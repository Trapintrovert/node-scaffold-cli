import inquirer from 'inquirer';
import chalk from 'chalk';
import path from 'path';
import { generateFiles } from '../generators/fileGenerator';
import { toCamelCase, toPascalCase } from '../utils/stringUtils';

interface AddOptions {
  orm: 'knex' | 'mongodb';
  path: string;
  di: boolean;
}

const VALID_COMPONENTS = ['model', 'repository', 'service', 'controller'];

export async function addComponent(componentType: string, resourceName: string, options: AddOptions) {
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
        message: 'Enter model fields (comma-separated, e.g., name:string,email:string,age:number):'
      }
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
    fields: parseFields(fields)
  };

  await generateFiles(config);

  const componentPlural = component === 'repository' ? 'repositories' : `${component}s`;
  const filePath = path.join(options.path, componentPlural, `${resourceName.toLowerCase()}.${component}.ts`);

  console.log(chalk.green('\n✅ Component added successfully!\n'));
  console.log(chalk.cyan('Generated file:'));
  console.log(chalk.gray(`  - ${filePath}`));

  // Provide contextual next steps
  console.log(chalk.yellow('\n💡 Next steps:'));
  
  switch (component) {
    case 'model':
      console.log(chalk.gray('  1. Review the generated model'));
      if (options.orm === 'knex') {
        console.log(chalk.gray('  2. Create a migration for this model'));
        console.log(chalk.gray('  3. Run migrations: npx knex migrate:latest'));
      }
      break;
    case 'repository':
      console.log(chalk.gray('  1. Ensure the model exists'));
      console.log(chalk.gray('  2. Implement custom query methods if needed'));
      console.log(chalk.gray('  3. Register in DI container if using DI'));
      break;
    case 'service':
      console.log(chalk.gray('  1. Ensure repository and model exist'));
      console.log(chalk.gray('  2. Implement business logic'));
      console.log(chalk.gray('  3. Add validation rules'));
      console.log(chalk.gray('  4. Register in DI container if using DI'));
      break;
    case 'controller':
      console.log(chalk.gray('  1. Ensure service exists'));
      console.log(chalk.gray('  2. Register routes in your Express app'));
      console.log(chalk.gray('  3. Add authentication/authorization middleware if needed'));
      console.log(chalk.gray('  4. Register in DI container if using DI'));
      break;
  }
}

function parseFields(fieldsString: string): Array<{ name: string; type: string }> {
  if (!fieldsString.trim()) return [];
  
  return fieldsString.split(',').map(field => {
    const [name, type = 'string'] = field.trim().split(':');
    return { name: name.trim(), type: type.trim() };
  });
}
