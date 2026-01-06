import inquirer from 'inquirer';
import chalk from 'chalk';
import path from 'path';
import { generateFiles } from '../generators/fileGenerator';
import { capitalize, toCamelCase, toPascalCase } from '../utils/stringUtils';

interface GenerateOptions {
  orm: 'knex' | 'mongodb';
  path: string;
  di: boolean;
}

export async function generateResource(resourceName: string, options: GenerateOptions) {
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
        { name: 'Controller', value: 'controller', checked: true }
      ]
    },
    {
      type: 'input',
      name: 'fields',
      message: 'Enter model fields (comma-separated, e.g., name:string,email:string,age:number):',
      when: (answers) => answers.components.includes('model')
    }
  ]);

  const config = {
    resourceName: resourceName.toLowerCase(),
    resourceNamePascal: toPascalCase(resourceName),
    resourceNameCamel: toCamelCase(resourceName),
    orm: options.orm,
    basePath: options.path,
    useDI: options.di,
    components: answers.components,
    fields: parseFields(answers.fields || '')
  };

  await generateFiles(config);

  console.log(chalk.green('\n✅ Resource generated successfully!\n'));
  console.log(chalk.cyan('Generated files:'));
  
  answers.components.forEach((component: string) => {
    const filePath = getFilePath(config.basePath, resourceName, component);
    console.log(chalk.gray(`  - ${filePath}`));
  });

  console.log(chalk.yellow('\n💡 Next steps:'));
  console.log(chalk.gray('  1. Review the generated files'));
  console.log(chalk.gray('  2. Implement business logic in the service'));
  console.log(chalk.gray('  3. Register dependencies in your DI container'));
}

function parseFields(fieldsString: string): Array<{ name: string; type: string }> {
  if (!fieldsString.trim()) return [];
  
  return fieldsString.split(',').map(field => {
    const [name, type = 'string'] = field.trim().split(':');
    return { name: name.trim(), type: type.trim() };
  });
}

function getFilePath(basePath: string, resourceName: string, component: string): string {
  const componentPlural = component === 'repository' ? 'repositories' : `${component}s`;
  return path.join(basePath, componentPlural, `${resourceName}.${component}.ts`);
}
