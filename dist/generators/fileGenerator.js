"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFiles = generateFiles;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
const model_template_1 = require("../templates/model.template");
const repository_template_1 = require("../templates/repository.template");
const service_template_1 = require("../templates/service.template");
const controller_template_1 = require("../templates/controller.template");
async function generateFiles(config) {
    const generators = {
        model: model_template_1.generateModel,
        repository: repository_template_1.generateRepository,
        service: service_template_1.generateService,
        controller: controller_template_1.generateController
    };
    const result = {
        created: [],
        skipped: [],
        overwritten: []
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
            const fileExists = await fs_extra_1.default.pathExists(filePath);
            if (fileExists) {
                // Prompt user to confirm overwrite
                const { overwrite } = await inquirer_1.default.prompt([
                    {
                        type: 'confirm',
                        name: 'overwrite',
                        message: chalk_1.default.yellow(`File ${chalk_1.default.cyan(filePath)} already exists. Overwrite it?`),
                        default: false
                    }
                ]);
                if (!overwrite) {
                    console.log(chalk_1.default.gray(`  ⏭️  Skipped: ${filePath}`));
                    result.skipped.push(filePath);
                    continue;
                }
                result.overwritten.push(filePath);
            }
            await fs_extra_1.default.ensureDir(path_1.default.dirname(filePath));
            await fs_extra_1.default.writeFile(filePath, content, 'utf-8');
            if (fileExists) {
                console.log(chalk_1.default.yellow(`  ✏️  Overwritten: ${filePath}`));
            }
            else {
                console.log(chalk_1.default.green(`  ✅ Created: ${filePath}`));
                result.created.push(filePath);
            }
        }
    }
    return result;
}
function getComponentPath(config, component) {
    const { basePath, resourceName } = config;
    const componentPlural = component === 'repository' ? 'repositories' : `${component}s`;
    return path_1.default.join(basePath, componentPlural, `${resourceName}.${component}.ts`);
}
/**
 * Ensures reflect-metadata is imported in the entry point file.
 * Checks common entry point files and adds the import if missing.
 */
async function ensureReflectMetadataImport(basePath) {
    const commonEntryPoints = [
        'index.ts',
        'app.ts',
        'main.ts',
        'server.ts',
        'config/container.ts'
    ];
    for (const entryPoint of commonEntryPoints) {
        const entryPath = path_1.default.join(basePath, '..', entryPoint);
        const altEntryPath = path_1.default.join(basePath, entryPoint);
        // Try both relative to basePath and one level up
        const pathsToCheck = [entryPath, altEntryPath];
        for (const filePath of pathsToCheck) {
            if (await fs_extra_1.default.pathExists(filePath)) {
                const content = await fs_extra_1.default.readFile(filePath, 'utf-8');
                // Check if reflect-metadata is already imported
                if (content.includes("import 'reflect-metadata'") ||
                    content.includes('import "reflect-metadata"') ||
                    content.includes("require('reflect-metadata')") ||
                    content.includes('require("reflect-metadata")')) {
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
                await fs_extra_1.default.writeFile(filePath, lines.join('\n'), 'utf-8');
                console.log(chalk_1.default.cyan(`  📦 Added reflect-metadata import to ${path_1.default.relative(process.cwd(), filePath)}`));
                return;
            }
        }
    }
    // If no entry point found, show a warning
    console.log(chalk_1.default.yellow('\n  ⚠️  Warning: Could not find entry point file to add reflect-metadata import.'));
    console.log(chalk_1.default.gray('     Please manually add: import "reflect-metadata"; at the top of your app entry file.'));
}
//# sourceMappingURL=fileGenerator.js.map