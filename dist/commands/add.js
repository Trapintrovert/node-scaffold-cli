"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addComponent = addComponent;
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
const path_1 = __importDefault(require("path"));
const fileGenerator_1 = require("../generators/fileGenerator");
const stringUtils_1 = require("../utils/stringUtils");
const VALID_COMPONENTS = ['model', 'repository', 'service', 'controller'];
async function addComponent(componentType, resourceName, options) {
    // Validate component type
    if (!VALID_COMPONENTS.includes(componentType.toLowerCase())) {
        throw new Error(`Invalid component type: ${componentType}\n` +
            `Valid types are: ${VALID_COMPONENTS.join(', ')}`);
    }
    const component = componentType.toLowerCase();
    console.log(chalk_1.default.blue(`\n🚀 Adding ${component} for: ${resourceName}\n`));
    // Prepare answers based on component type
    let fields = '';
    if (component === 'model') {
        const modelAnswers = await inquirer_1.default.prompt([
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
        resourceNamePascal: (0, stringUtils_1.toPascalCase)(resourceName),
        resourceNameCamel: (0, stringUtils_1.toCamelCase)(resourceName),
        orm: options.orm,
        basePath: options.path,
        useDI: options.di,
        components: [component],
        fields: parseFields(fields)
    };
    await (0, fileGenerator_1.generateFiles)(config);
    const componentPlural = component === 'repository' ? 'repositories' : `${component}s`;
    const filePath = path_1.default.join(options.path, componentPlural, `${resourceName.toLowerCase()}.${component}.ts`);
    console.log(chalk_1.default.green('\n✅ Component added successfully!\n'));
    console.log(chalk_1.default.cyan('Generated file:'));
    console.log(chalk_1.default.gray(`  - ${filePath}`));
    // Provide contextual next steps
    console.log(chalk_1.default.yellow('\n💡 Next steps:'));
    switch (component) {
        case 'model':
            console.log(chalk_1.default.gray('  1. Review the generated model'));
            if (options.orm === 'knex') {
                console.log(chalk_1.default.gray('  2. Create a migration for this model'));
                console.log(chalk_1.default.gray('  3. Run migrations: npx knex migrate:latest'));
            }
            break;
        case 'repository':
            console.log(chalk_1.default.gray('  1. Ensure the model exists'));
            console.log(chalk_1.default.gray('  2. Implement custom query methods if needed'));
            console.log(chalk_1.default.gray('  3. Register in DI container if using DI'));
            break;
        case 'service':
            console.log(chalk_1.default.gray('  1. Ensure repository and model exist'));
            console.log(chalk_1.default.gray('  2. Implement business logic'));
            console.log(chalk_1.default.gray('  3. Add validation rules'));
            console.log(chalk_1.default.gray('  4. Register in DI container if using DI'));
            break;
        case 'controller':
            console.log(chalk_1.default.gray('  1. Ensure service exists'));
            console.log(chalk_1.default.gray('  2. Register routes in your Express app'));
            console.log(chalk_1.default.gray('  3. Add authentication/authorization middleware if needed'));
            console.log(chalk_1.default.gray('  4. Register in DI container if using DI'));
            break;
    }
}
function parseFields(fieldsString) {
    if (!fieldsString.trim())
        return [];
    return fieldsString.split(',').map(field => {
        const [name, type = 'string'] = field.trim().split(':');
        return { name: name.trim(), type: type.trim() };
    });
}
//# sourceMappingURL=add.js.map