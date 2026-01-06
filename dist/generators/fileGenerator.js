"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFiles = generateFiles;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
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
    for (const component of config.components) {
        if (generators[component]) {
            const content = generators[component](config);
            const filePath = getComponentPath(config, component);
            await fs_extra_1.default.ensureDir(path_1.default.dirname(filePath));
            await fs_extra_1.default.writeFile(filePath, content, 'utf-8');
        }
    }
}
function getComponentPath(config, component) {
    const { basePath, resourceName } = config;
    const componentPlural = component === 'repository' ? 'repositories' : `${component}s`;
    return path_1.default.join(basePath, componentPlural, `${resourceName}.${component}.ts`);
}
//# sourceMappingURL=fileGenerator.js.map