import fs from 'fs-extra';
import path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { generateModel } from '../templates/model.template';
import { generateRepository } from '../templates/repository.template';
import { generateService } from '../templates/service.template';
import { generateController } from '../templates/controller.template';
import { generateRouter } from '../templates/router.template';

interface GenerateConfig {
  resourceName: string;
  resourceNamePascal: string;
  resourceNameCamel: string;
  orm: 'knex' | 'mongoose';
  basePath: string;
  useDI: boolean;
  components: string[];
  fields: Array<{ name: string; type: string }>;
}

export interface GenerationResult {
  created: string[];
  skipped: string[];
  overwritten: string[];
}

export async function generateFiles(
  config: GenerateConfig
): Promise<GenerationResult> {
  const generators: Record<string, (config: GenerateConfig) => string> = {
    model: generateModel,
    repository: generateRepository,
    service: generateService,
    controller: generateController,
    router: generateRouter,
  };

  const result: GenerationResult = {
    created: [],
    skipped: [],
    overwritten: [],
  };

  // Handle reflect-metadata import if DI is enabled
  if (config.useDI) {
    await ensureReflectMetadataImport(config.basePath);
  }

  for (const component of config.components) {
    if (generators[component]) {
      const content = generators[component](config);
      const filePath = getComponentPath(config, component);

      // Check if file already exists
      const fileExists = await fs.pathExists(filePath);

      if (fileExists) {
        // Prompt user to confirm overwrite
        const { overwrite } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'overwrite',
            message: chalk.yellow(
              `File ${chalk.cyan(filePath)} already exists. Overwrite it?`
            ),
            default: false,
          },
        ]);

        if (!overwrite) {
          console.log(chalk.gray(`  ⏭️  Skipped: ${filePath}`));
          result.skipped.push(filePath);
          continue;
        }

        result.overwritten.push(filePath);
      }

      await fs.ensureDir(path.dirname(filePath));
      await fs.writeFile(filePath, content, 'utf-8');

      if (fileExists) {
        console.log(chalk.yellow(`  ✏️  Overwritten: ${filePath}`));
      } else {
        console.log(chalk.green(`  ✅ Created: ${filePath}`));
        result.created.push(filePath);
      }

      // Update barrel export in index.ts
      await updateBarrelExport(config, component);
    }
  }

  return result;
}

function getComponentPath(config: GenerateConfig, component: string): string {
  const { basePath, resourceName } = config;
  let componentPlural: string;

  if (component === 'repository') {
    componentPlural = 'repositories';
  } else if (component === 'router') {
    componentPlural = 'routers';
  } else {
    componentPlural = `${component}s`;
  }

  return path.join(
    basePath,
    componentPlural,
    `${resourceName}.${component}.ts`
  );
}

/**
 * Ensures reflect-metadata is imported in the entry point file.
 * Checks common entry point files and adds the import if missing.
 */
async function ensureReflectMetadataImport(basePath: string): Promise<void> {
  const commonEntryPoints = [
    'index.ts',
    'app.ts',
    'main.ts',
    'server.ts',
    'config/container.ts',
  ];

  for (const entryPoint of commonEntryPoints) {
    const entryPath = path.join(basePath, '..', entryPoint);
    const altEntryPath = path.join(basePath, entryPoint);

    // Try both relative to basePath and one level up
    const pathsToCheck = [entryPath, altEntryPath];

    for (const filePath of pathsToCheck) {
      if (await fs.pathExists(filePath)) {
        const content = await fs.readFile(filePath, 'utf-8');

        // Check if reflect-metadata is already imported
        if (
          content.includes("import 'reflect-metadata'") ||
          content.includes('import "reflect-metadata"') ||
          content.includes("require('reflect-metadata')") ||
          content.includes('require("reflect-metadata")')
        ) {
          // Already imported, nothing to do
          return;
        }

        // Add import at the top of the file
        const lines = content.split('\n');
        let insertIndex = 0;

        // Skip shebang if present
        if (lines[0]?.startsWith('#!')) {
          insertIndex = 1;
        }

        // Skip empty lines at the top
        while (insertIndex < lines.length && lines[insertIndex].trim() === '') {
          insertIndex++;
        }

        // Insert the import
        lines.splice(insertIndex, 0, "import 'reflect-metadata';");

        await fs.writeFile(filePath, lines.join('\n'), 'utf-8');
        console.log(
          chalk.cyan(
            `  📦 Added reflect-metadata import to ${path.relative(
              process.cwd(),
              filePath
            )}`
          )
        );
        return;
      }
    }
  }

  // If no entry point found, show a warning
  console.log(
    chalk.yellow(
      '\n  ⚠️  Warning: Could not find entry point file to add reflect-metadata import.'
    )
  );
  console.log(
    chalk.gray(
      '     Please manually add: import "reflect-metadata"; at the top of your app entry file.'
    )
  );
}

/**
 * Updates or creates index.ts barrel export file for the component folder
 */
async function updateBarrelExport(
  config: GenerateConfig,
  component: string
): Promise<void> {
  const { basePath, resourceName } = config;
  let componentPlural: string;

  if (component === 'repository') {
    componentPlural = 'repositories';
  } else if (component === 'router') {
    componentPlural = 'routers';
  } else {
    componentPlural = `${component}s`;
  }

  const componentDir = path.join(basePath, componentPlural);
  const indexFilePath = path.join(componentDir, 'index.ts');

  // Generate export statement
  const exportStatement = `export * from './${resourceName}.${component}';`;
  const exportStatementWithNewline = `${exportStatement}\n`;

  // Check if index.ts exists
  const indexExists = await fs.pathExists(indexFilePath);

  if (!indexExists) {
    // Create new index.ts file
    await fs.writeFile(indexFilePath, exportStatementWithNewline, 'utf-8');
    console.log(
      chalk.cyan(`  📦 Created ${componentPlural}/index.ts with barrel export`)
    );
    return;
  }

  // Read existing index.ts
  const existingContent = await fs.readFile(indexFilePath, 'utf-8');

  // Check if export already exists
  const exportPattern = new RegExp(
    `export\\s+\\*\\s+from\\s+['"]\\./${resourceName}\\.${component}['"];?`,
    'g'
  );

  if (exportPattern.test(existingContent)) {
    // Export already exists, skip
    return;
  }

  // Add export to the end of the file
  const lines = existingContent.split('\n');
  // Remove trailing empty lines
  while (lines.length > 0 && lines[lines.length - 1].trim() === '') {
    lines.pop();
  }

  // Add new export
  lines.push(exportStatement);

  // Write back
  await fs.writeFile(indexFilePath, lines.join('\n') + '\n', 'utf-8');
  console.log(
    chalk.cyan(`  📦 Updated ${componentPlural}/index.ts with new export`)
  );
}
