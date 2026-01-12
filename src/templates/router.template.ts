interface GenerateConfig {
  resourceName: string;
  resourceNamePascal: string;
  resourceNameCamel: string;
  orm: 'knex' | 'mongoose';
  basePath: string;
  useDI: boolean;
  components: string[];
  fields: Array<{ name: string; type: string }>;
}

export function generateRouter(config: GenerateConfig): string {
  const { resourceNamePascal, resourceName, useDI } = config;

  const decorator = useDI ? '@injectable()\n' : '';
  const imports = useDI
    ? `import { injectable, inject } from 'tsyringe';\n`
    : '';

  return `${imports}import { Router } from 'express';
import { ${resourceNamePascal}Controller } from '../controllers/${resourceName}.controller';

${decorator}export class ${resourceNamePascal}Router {
  public router: Router;
  
  constructor(
    ${useDI ? `@inject(${resourceNamePascal}Controller) ` : ''}private ${resourceName}Controller: ${resourceNamePascal}Controller
  ) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // GET /${resourceName}s - Get all ${resourceName}s
    this.router.get('/', this.${resourceName}Controller.getAll);

    // GET /${resourceName}s/:id - Get ${resourceName} by ID
    this.router.get('/:id', this.${resourceName}Controller.getById);

    // POST /${resourceName}s - Create a new ${resourceName}
    this.router.post('/', this.${resourceName}Controller.create);

    // PUT /${resourceName}s/:id - Update ${resourceName} by ID
    this.router.put('/:id', this.${resourceName}Controller.update);

    // DELETE /${resourceName}s/:id - Delete ${resourceName} by ID
    this.router.delete('/:id', this.${resourceName}Controller.delete);
  }
}
`;
}
