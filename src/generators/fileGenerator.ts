import fs from 'fs-extra';
import path from 'path';
import { generateModel } from '../templates/model.template';
import { generateRepository } from '../templates/repository.template';
import { generateService } from '../templates/service.template';
import { generateController } from '../templates/controller.template';

interface GenerateConfig {
  resourceName: string;
  resourceNamePascal: string;
  resourceNameCamel: string;
  orm: 'knex' | 'mongodb';
  basePath: string;
  useDI: boolean;
  components: string[];
  fields: Array<{ name: string; type: string }>;
}

export async function generateFiles(config: GenerateConfig) {
  const generators: Record<string, (config: GenerateConfig) => string> = {
    model: generateModel,
    repository: generateRepository,
    service: generateService,
    controller: generateController
  };

  for (const component of config.components) {
    if (generators[component]) {
      const content = generators[component](config);
      const filePath = getComponentPath(config, component);
      
      await fs.ensureDir(path.dirname(filePath));
      await fs.writeFile(filePath, content, 'utf-8');
    }
  }
}

function getComponentPath(config: GenerateConfig, component: string): string {
  const { basePath, resourceName } = config;
  const componentPlural = component === 'repository' ? 'repositories' : `${component}s`;
  return path.join(basePath, componentPlural, `${resourceName}.${component}.ts`);
}
