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

export function generateModel(config: GenerateConfig): string {
  const { resourceNamePascal, orm, fields } = config;

  if (orm === 'knex') {
    return generateObjectionModel(resourceNamePascal, fields);
  } else if (orm === 'mongoose') {
    return generateMongooseModel(resourceNamePascal, fields);
  }

  throw new Error(`Unsupported ORM/ODM: ${orm}`);
}

function generateObjectionModel(
  className: string,
  fields: Array<{ name: string; type: string }>
): string {
  const tableName = className.toLowerCase() + 's';

  const schemaProperties = fields
    .map((f) => `        ${f.name}: { type: '${getJsonSchemaType(f.type)}' },`)
    .join('\n');

  return `import { Model } from 'objection';

export class ${className} extends Model {
  static tableName = '${tableName}';
  
  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'integer' },
${schemaProperties}
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' }
      }
    };
  }
}
`;
}

function generateMongooseModel(
  className: string,
  fields: Array<{ name: string; type: string }>
): string {
  const schemaFields = fields
    .map((f) => `  ${f.name}: ${getMongooseType(f.type)},`)
    .join('\n');

  return `import mongoose from 'mongoose';

const ${className}Schema = new mongoose.Schema({
${schemaFields}
}, {
  timestamps: true
});

export const ${className}Model = mongoose.model('${className}', ${className}Schema);
`;
}

function getJsonSchemaType(type: string): string {
  const typeMap: Record<string, string> = {
    string: 'string',
    number: 'number',
    boolean: 'boolean',
    date: 'string',
    object: 'object',
    array: 'array'
  };

  return typeMap[type.toLowerCase()] || 'string';
}

function getMongooseType(type: string): string {
  const typeMap: Record<string, string> = {
    string: 'String',
    number: 'Number',
    boolean: 'Boolean',
    date: 'Date',
    object: 'Object',
    array: 'Array'
  };

  return typeMap[type.toLowerCase()] || 'mongoose.Schema.Types.Mixed';
}
