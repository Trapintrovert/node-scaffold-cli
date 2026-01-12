"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addComponent = addComponent;
const chalk_1 = __importDefault(require("chalk"));
const path_1 = __importDefault(require("path"));
const fileGenerator_1 = require("../generators/fileGenerator");
const stringUtils_1 = require("../utils/stringUtils");
const VALID_COMPONENTS = ['model', 'repository', 'service', 'controller', 'router'];
async function addComponent(componentType, resourceName, options) {
    // Validate component type
    if (!VALID_COMPONENTS.includes(componentType.toLowerCase())) {
        throw new Error(`Invalid component type: ${componentType}\n` +
            `Valid types are: ${VALID_COMPONENTS.join(', ')}`);
    }
    const component = componentType.toLowerCase();
    console.log(chalk_1.default.blue(`\n🚀 Adding ${component} for: ${resourceName}\n`));
    const config = {
        resourceName: resourceName.toLowerCase(),
        resourceNamePascal: (0, stringUtils_1.toPascalCase)(resourceName),
        resourceNameCamel: (0, stringUtils_1.toCamelCase)(resourceName),
        orm: options.orm,
        basePath: options.path,
        useDI: options.di,
        components: [component],
        fields: [],
    };
    const result = await (0, fileGenerator_1.generateFiles)(config);
    let componentPlural;
    if (component === 'repository') {
        componentPlural = 'repositories';
    }
    else if (component === 'router') {
        componentPlural = 'routers';
    }
    else {
        componentPlural = `${component}s`;
    }
    const filePath = path_1.default.join(options.path, componentPlural, `${resourceName.toLowerCase()}.${component}.ts`);
    console.log(chalk_1.default.green('\n✅ Component operation completed!\n'));
    if (result.created.length > 0) {
        console.log(chalk_1.default.cyan('Created file:'));
        console.log(chalk_1.default.gray(`  - ${filePath}`));
    }
    if (result.overwritten.length > 0) {
        console.log(chalk_1.default.yellow('Overwritten file:'));
        console.log(chalk_1.default.gray(`  - ${filePath}`));
    }
    if (result.skipped.length > 0) {
        console.log(chalk_1.default.gray('Skipped file (already exists):'));
        console.log(chalk_1.default.gray(`  - ${filePath}`));
        return; // Don't show next steps if file was skipped
    }
    // Provide contextual next steps
    console.log(chalk_1.default.yellow('\n💡 Next steps:'));
    switch (component) {
        case 'model':
            console.log(chalk_1.default.gray('  1. Review the generated model'));
            if (options.orm === 'knex') {
                console.log(chalk_1.default.gray('  2. Create a migration for this model'));
                console.log(chalk_1.default.gray('  3. Run migrations: npx knex migrate:latest'));
            }
            if (options.di) {
                console.log(chalk_1.default.gray('  4. Install reflect-metadata if not already: npm install reflect-metadata'));
            }
            break;
        case 'repository':
            console.log(chalk_1.default.gray('  1. Ensure the model exists'));
            console.log(chalk_1.default.gray('  2. Implement custom query methods if needed'));
            if (options.di) {
                console.log(chalk_1.default.gray('  3. Install reflect-metadata if not already: npm install reflect-metadata'));
                console.log(chalk_1.default.gray('  4. Register in DI container'));
            }
            break;
        case 'service':
            console.log(chalk_1.default.gray('  1. Ensure repository and model exist'));
            console.log(chalk_1.default.gray('  2. Implement business logic'));
            console.log(chalk_1.default.gray('  3. Add validation rules'));
            if (options.di) {
                console.log(chalk_1.default.gray('  4. Install reflect-metadata if not already: npm install reflect-metadata'));
                console.log(chalk_1.default.gray('  5. Register in DI container'));
            }
            break;
        case 'controller':
            console.log(chalk_1.default.gray('  1. Ensure service exists'));
            console.log(chalk_1.default.gray('  2. Register routes in your Express app'));
            console.log(chalk_1.default.gray('  3. Add authentication/authorization middleware if needed'));
            if (options.di) {
                console.log(chalk_1.default.gray('  4. Install reflect-metadata if not already: npm install reflect-metadata'));
                console.log(chalk_1.default.gray('  5. Register in DI container'));
            }
            break;
        case 'router':
            console.log(chalk_1.default.gray('  1. Ensure controller exists'));
            console.log(chalk_1.default.gray('  2. Register router in your Express app'));
            console.log(chalk_1.default.gray('  3. Example: app.use("/api/users", userRouter.router)'));
            console.log(chalk_1.default.gray('  4. Add authentication/authorization middleware if needed'));
            if (options.di) {
                console.log(chalk_1.default.gray('  5. Install reflect-metadata if not already: npm install reflect-metadata'));
                console.log(chalk_1.default.gray('  6. Register in DI container'));
            }
            break;
    }
}
//# sourceMappingURL=add.js.map