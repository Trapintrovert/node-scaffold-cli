import inquirer from 'inquirer';
import chalk from 'chalk';
import { generateFiles } from '../generators/fileGenerator';
import { toCamelCase, toPascalCase } from '../utils/stringUtils';

interface GenerateOptions {
  orm: 'knex' | 'mongoose';
  path: string;
  di: boolean;
}

export async function generateResource(
  resourceName: string,
  options: GenerateOptions
) {
  console.log(chalk.blue(`\n🚀 Generating resource: ${resourceName}\n`));

  // Prompt for additional details
  const answers = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'components',
      message: 'Select components to generate:',
      choices: [
        { name: 'Model', value: 'model', checked: true },
        { name: 'Repository', value: 'repository', checked: true },
        { name: 'Service', value: 'service', checked: true },
        { name: 'Controller', value: 'controller', checked: true },
      ],
    },
  ]);

  const config = {
    resourceName: resourceName.toLowerCase(),
    resourceNamePascal: toPascalCase(resourceName),
    resourceNameCamel: toCamelCase(resourceName),
    orm: options.orm,
    basePath: options.path,
    useDI: options.di,
    components: answers.components,
    fields: [],
  };

  const result = await generateFiles(config);

  // Display summary
  console.log(chalk.green('\n✅ Resource generation completed!\n'));

  if (result.created.length > 0) {
    console.log(chalk.cyan('Created files:'));
    result.created.forEach((filePath) => {
      console.log(chalk.gray(`  - ${filePath}`));
    });
  }

  if (result.overwritten.length > 0) {
    console.log(chalk.yellow('\nOverwritten files:'));
    result.overwritten.forEach((filePath) => {
      console.log(chalk.gray(`  - ${filePath}`));
    });
  }

  if (result.skipped.length > 0) {
    console.log(chalk.gray('\nSkipped files (already exist):'));
    result.skipped.forEach((filePath) => {
      console.log(chalk.gray(`  - ${filePath}`));
    });
  }

  console.log(chalk.yellow('\n💡 Next steps:'));
  console.log(chalk.gray('  1. Review the generated files'));
  if (options.di) {
    console.log(
      chalk.gray(
        '  2. Install reflect-metadata if not already: npm install reflect-metadata'
      )
    );
    console.log(chalk.gray('  3. Implement business logic in the service'));
    console.log(chalk.gray('  4. Register dependencies in your DI container'));
  } else {
    console.log(chalk.gray('  2. Implement business logic in the service'));
  }
}
