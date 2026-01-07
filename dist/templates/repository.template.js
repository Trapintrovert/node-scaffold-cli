"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRepository = generateRepository;
function generateRepository(config) {
    const { resourceNamePascal, resourceName, orm, useDI } = config;
    if (orm === 'knex') {
        return generateKnexRepository(resourceNamePascal, resourceName, useDI);
    }
    else if (orm === 'mongoose') {
        return generateMongoRepository(resourceNamePascal, resourceName, useDI);
    }
    throw new Error(`Unsupported ORM/ODM: ${orm}`);
}
function generateKnexRepository(className, resourceName, useDI) {
    const decorator = useDI ? '@injectable()\n' : '';
    const imports = useDI
        ? `import { injectable, inject } from 'tsyringe';\nimport { Knex } from 'knex';\n`
        : `import { Knex } from 'knex';\n`;
    return `${imports}import { ${className} } from '../models/${resourceName}.model';

export interface I${className}Repository {
  findById(id: number): Promise<${className} | undefined>;
  findAll(): Promise<${className}[]>;
  create(data: Omit<${className}, 'id' | 'created_at' | 'updated_at'>): Promise<${className}>;
  update(id: number, data: Partial<${className}>): Promise<${className} | undefined>;
  delete(id: number): Promise<boolean>;
}

${decorator}export class ${className}Repository implements I${className}Repository {
  private tableName = '${resourceName}s';

  constructor(
    ${useDI ? `@inject('Database') ` : ''}private db: Knex
  ) {}

  async findById(id: number): Promise<${className} | undefined> {
    return this.db<${className}>(this.tableName)
      .where({ id })
      .first();
  }

  async findAll(): Promise<${className}[]> {
    return this.db<${className}>(this.tableName).select('*');
  }

  async findByFilter(filter: Partial<${className}>): Promise<${className}[]> {
    return this.db<${className}>(this.tableName)
      .where(filter)
      .select('*');
  }

  async create(data: Omit<${className}, 'id' | 'created_at' | 'updated_at'>): Promise<${className}> {
    const [result] = await this.db<${className}>(this.tableName)
      .insert({
        ...data,
        created_at: this.db.fn.now(),
        updated_at: this.db.fn.now()
      })
      .returning('*');
    
    return result;
  }

  async update(id: number, data: Partial<${className}>): Promise<${className} | undefined> {
    const [result] = await this.db<${className}>(this.tableName)
      .where({ id })
      .update({
        ...data,
        updated_at: this.db.fn.now()
      })
      .returning('*');
    
    return result;
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await this.db<${className}>(this.tableName)
      .where({ id })
      .delete();
    
    return deleted > 0;
  }

  async count(filter?: Partial<${className}>): Promise<number> {
    const query = this.db<${className}>(this.tableName).count('* as count');
    
    if (filter) {
      query.where(filter);
    }
    
    const [{ count }] = await query;
    return Number(count);
  }
}
`;
}
function generateMongoRepository(className, resourceName, useDI) {
    const decorator = useDI ? '@injectable()\n' : '';
    const imports = useDI
        ? `import { injectable } from 'tsyringe';\nimport { FilterQuery } from 'mongoose';\n`
        : `import { FilterQuery } from 'mongoose';\n`;
    return `${imports}import { ${className}, ${className}Model } from '../models/${resourceName}.model';

export interface I${className}Repository {
  findById(id: string): Promise<${className} | null>;
  findAll(): Promise<${className}[]>;
  create(data: Partial<${className}>): Promise<${className}>;
  update(id: string, data: Partial<${className}>): Promise<${className} | null>;
  delete(id: string): Promise<boolean>;
}

${decorator}export class ${className}Repository implements I${className}Repository {
  async findById(id: string): Promise<${className} | null> {
    return ${className}Model.findById(id).exec();
  }

  async findAll(): Promise<${className}[]> {
    return ${className}Model.find().exec();
  }

  async findByFilter(filter: FilterQuery<${className}>): Promise<${className}[]> {
    return ${className}Model.find(filter).exec();
  }

  async create(data: Partial<${className}>): Promise<${className}> {
    const entity = new ${className}Model(data);
    return entity.save();
  }

  async update(id: string, data: Partial<${className}>): Promise<${className} | null> {
    return ${className}Model.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    ).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await ${className}Model.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async count(filter?: FilterQuery<${className}>): Promise<number> {
    return ${className}Model.countDocuments(filter || {}).exec();
  }

  async exists(filter: FilterQuery<${className}>): Promise<boolean> {
    const count = await ${className}Model.countDocuments(filter).limit(1).exec();
    return count > 0;
  }
}
`;
}
//# sourceMappingURL=repository.template.js.map