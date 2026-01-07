"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateService = generateService;
function generateService(config) {
    const { resourceNamePascal, resourceName, orm, useDI } = config;
    const decorator = useDI ? '@injectable()\n' : '';
    const imports = useDI
        ? `import { injectable, inject } from 'tsyringe';\n`
        : '';
    const idType = orm === 'knex' ? 'number' : 'string'; // mongoose uses string IDs
    return `${imports}import { ${resourceNamePascal} } from '../models/${resourceName}.model';
import { ${resourceNamePascal}Repository } from '../repositories/${resourceName}.repository';

export interface I${resourceNamePascal}Service {
  getById(id: ${idType}): Promise<${resourceNamePascal} | null>;
  getAll(): Promise<${resourceNamePascal}[]>;
  create(data: Partial<${resourceNamePascal}>): Promise<${resourceNamePascal}>;
  update(id: ${idType}, data: Partial<${resourceNamePascal}>): Promise<${resourceNamePascal} | null>;
  delete(id: ${idType}): Promise<boolean>;
}

${decorator}export class ${resourceNamePascal}Service implements I${resourceNamePascal}Service {
  constructor(
    ${useDI ? `@inject(${resourceNamePascal}Repository) ` : ''}private ${resourceName}Repository: ${resourceNamePascal}Repository
  ) {}

  async getById(id: ${idType}): Promise<${resourceNamePascal} | null> {
    const ${resourceName} = await this.${resourceName}Repository.findById(id);
    
    if (!${resourceName}) {
      return null;
    }

    return ${resourceName};
  }

  async getAll(): Promise<${resourceNamePascal}[]> {
    return this.${resourceName}Repository.findAll();
  }

  async create(data: Partial<${resourceNamePascal}>): Promise<${resourceNamePascal}> {
    // Add validation logic here
    this.validateCreateData(data);

    return this.${resourceName}Repository.create(data);
  }

  async update(id: ${idType}, data: Partial<${resourceNamePascal}>): Promise<${resourceNamePascal} | null> {
    const existing = await this.${resourceName}Repository.findById(id);
    
    if (!existing) {
      return null;
    }

    // Add validation logic here
    this.validateUpdateData(data);

    return this.${resourceName}Repository.update(id, data);
  }

  async delete(id: ${idType}): Promise<boolean> {
    const existing = await this.${resourceName}Repository.findById(id);
    
    if (!existing) {
      return false;
    }

    return this.${resourceName}Repository.delete(id);
  }

  private validateCreateData(data: Partial<${resourceNamePascal}>): void {
    // TODO: Implement validation logic
    // Example: Check required fields, validate formats, etc.
  }

  private validateUpdateData(data: Partial<${resourceNamePascal}>): void {
    // TODO: Implement validation logic
  }
}
`;
}
//# sourceMappingURL=service.template.js.map