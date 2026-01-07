"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateResource = generateResource;
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
const fileGenerator_1 = require("../generators/fileGenerator");
const stringUtils_1 = require("../utils/stringUtils");
async function generateResource(resourceName, options) {
    console.log(chalk_1.default.blue(`\n🚀 Generating resource: ${resourceName}\n`));
    // Prompt for additional details
    const answers = await inquirer_1.default.prompt([
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
        {
            type: 'input',
            name: 'fields',
            message: 'Enter model fields (comma-separated, e.g., name:string,email:string,age:number):',
            when: (answers) => answers.components.includes('model'),
        },
    ]);
    const config = {
        resourceName: resourceName.toLowerCase(),
        resourceNamePascal: (0, stringUtils_1.toPascalCase)(resourceName),
        resourceNameCamel: (0, stringUtils_1.toCamelCase)(resourceName),
        orm: options.orm,
        basePath: options.path,
        useDI: options.di,
        components: answers.components,
        fields: parseFields(answers.fields || ''),
    };
    const result = await (0, fileGenerator_1.generateFiles)(config);
    // Display summary
    console.log(chalk_1.default.green('\n✅ Resource generation completed!\n'));
    if (result.created.length > 0) {
        console.log(chalk_1.default.cyan('Created files:'));
        result.created.forEach((filePath) => {
            console.log(chalk_1.default.gray(`  - ${filePath}`));
        });
    }
    if (result.overwritten.length > 0) {
        console.log(chalk_1.default.yellow('\nOverwritten files:'));
        result.overwritten.forEach((filePath) => {
            console.log(chalk_1.default.gray(`  - ${filePath}`));
        });
    }
    if (result.skipped.length > 0) {
        console.log(chalk_1.default.gray('\nSkipped files (already exist):'));
        result.skipped.forEach((filePath) => {
            console.log(chalk_1.default.gray(`  - ${filePath}`));
        });
    }
    console.log(chalk_1.default.yellow('\n💡 Next steps:'));
    console.log(chalk_1.default.gray('  1. Review the generated files'));
    if (options.di) {
        console.log(chalk_1.default.gray('  2. Install reflect-metadata if not already: npm install reflect-metadata'));
        console.log(chalk_1.default.gray('  3. Implement business logic in the service'));
        console.log(chalk_1.default.gray('  4. Register dependencies in your DI container'));
    }
    else {
        console.log(chalk_1.default.gray('  2. Implement business logic in the service'));
    }
}
function parseFields(fieldsString) {
    if (!fieldsString.trim())
        return [];
    return fieldsString.split(',').map((field) => {
        const [name, type = 'string'] = field.trim().split(':');
        return { name: name.trim(), type: type.trim() };
    });
}
//# sourceMappingURL=generate.js.map