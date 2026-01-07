import inquirer from 'inquirer';
import chalk from 'chalk';
import path from 'path';
import { generateFiles } from '../generators/fileGenerator';
import { toCamelCase, toPascalCase } from '../utils/stringUtils';

interface AddOptions {
  orm: 'knex' | 'mongoose';
  path: string;
  di: boolean;
}

const VALID_COMPONENTS = ['model', 'repository', 'service', 'controller'];

export async function addComponent(
  componentType: string,
  resourceName: string,
  options: AddOptions
) {
  // Validate component type
  if (!VALID_COMPONENTS.includes(componentType.toLowerCase())) {
    throw new Error(
      `Invalid component type: ${componentType}\n` +
        `Valid types are: ${VALID_COMPONENTS.join(', ')}`
    );
  }

  const component = componentType.toLowerCase();

  console.log(chalk.blue(`\n🚀 Adding ${component} for: ${resourceName}\n`));

  // Prepare answers based on component type
  let fields: string = '';

  if (component === 'model') {
    const modelAnswers = await inquirer.prompt([
      {
        type: 'input',
        name: 'fields',
        message:
          'Enter model fields (comma-separated, e.g., name:string,email:string,age:number):',
      },
    ]);
    fields = modelAnswers.fields;
  }

  const config = {
    resourceName: resourceName.toLowerCase(),
    resourceNamePascal: toPascalCase(resourceName),
    resourceNameCamel: toCamelCase(resourceName),
    orm: options.orm,
    basePath: options.path,
    useDI: options.di,
    components: [component],
    fields: parseFields(fields),
  };

  const result = await generateFiles(config);

  const componentPlural =
    component === 'repository' ? 'repositories' : `${component}s`;
  const filePath = path.join(
    options.path,
    componentPlural,
    `${resourceName.toLowerCase()}.${component}.ts`
  );

  console.log(chalk.green('\n✅ Component operation completed!\n'));

  if (result.created.length > 0) {
    console.log(chalk.cyan('Created file:'));
    console.log(chalk.gray(`  - ${filePath}`));
  }

  if (result.overwritten.length > 0) {
    console.log(chalk.yellow('Overwritten file:'));
    console.log(chalk.gray(`  - ${filePath}`));
  }

  if (result.skipped.length > 0) {
    console.log(chalk.gray('Skipped file (already exists):'));
    console.log(chalk.gray(`  - ${filePath}`));
    return; // Don't show next steps if file was skipped
  }

  // Provide contextual next steps
  console.log(chalk.yellow('\n💡 Next steps:'));

  switch (component) {
    case 'model':
      console.log(chalk.gray('  1. Review the generated model'));
      if (options.orm === 'knex') {
        console.log(chalk.gray('  2. Create a migration for this model'));
        console.log(chalk.gray('  3. Run migrations: npx knex migrate:latest'));
      }
      if (options.di) {
        console.log(
          chalk.gray(
            '  4. Install reflect-metadata if not already: npm install reflect-metadata'
          )
        );
      }
      break;
    case 'repository':
      console.log(chalk.gray('  1. Ensure the model exists'));
      console.log(chalk.gray('  2. Implement custom query methods if needed'));
      if (options.di) {
        console.log(
          chalk.gray(
            '  3. Install reflect-metadata if not already: npm install reflect-metadata'
          )
        );
        console.log(chalk.gray('  4. Register in DI container'));
      }
      break;
    case 'service':
      console.log(chalk.gray('  1. Ensure repository and model exist'));
      console.log(chalk.gray('  2. Implement business logic'));
      console.log(chalk.gray('  3. Add validation rules'));
      if (options.di) {
        console.log(
          chalk.gray(
            '  4. Install reflect-metadata if not already: npm install reflect-metadata'
          )
        );
        console.log(chalk.gray('  5. Register in DI container'));
      }
      break;
    case 'controller':
      console.log(chalk.gray('  1. Ensure service exists'));
      console.log(chalk.gray('  2. Register routes in your Express app'));
      console.log(
        chalk.gray('  3. Add authentication/authorization middleware if needed')
      );
      if (options.di) {
        console.log(
          chalk.gray(
            '  4. Install reflect-metadata if not already: npm install reflect-metadata'
          )
        );
        console.log(chalk.gray('  5. Register in DI container'));
      }
      break;
  }
}

function parseFields(
  fieldsString: string
): Array<{ name: string; type: string }> {
  if (!fieldsString.trim()) return [];

  return fieldsString.split(',').map((field) => {
    const [name, type = 'string'] = field.trim().split(':');
    return { name: name.trim(), type: type.trim() };
  });
}
