# Development Guide

## Project Structure

```
node-scaffold-cli/
├── src/
│   ├── cli.ts                      # CLI entry point
│   ├── index.ts                    # Main exports
│   ├── commands/
│   │   └── generate.ts             # Generate command handler
│   ├── generators/
│   │   └── fileGenerator.ts        # File generation logic
│   ├── templates/
│   │   ├── model.template.ts       # Model templates
│   │   ├── repository.template.ts  # Repository templates
│   │   ├── service.template.ts     # Service templates
│   │   └── controller.template.ts  # Controller templates
│   └── utils/
│       └── stringUtils.ts          # String manipulation utilities
├── dist/                           # Compiled JavaScript
├── package.json
├── tsconfig.json
└── README.md
```

## Setup for Development

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd node-scaffold-cli
npm install
```

### 2. Build the Project

```bash
npm run build
```

### 3. Link for Local Testing

```bash
npm link
```

Now you can use `scaffold` command globally to test your changes.

### 4. Development Workflow

```bash
# Watch mode for automatic rebuilds
npm run dev

# In another terminal, test your changes
scaffold g test-resource --orm knex
```

## Adding New Features

### Adding a New Component Type

1. Create a new template file in `src/templates/`:

```typescript
// src/templates/middleware.template.ts
interface GenerateConfig {
  resourceName: string;
  resourceNamePascal: string;
  // ... other config properties
}

export function generateMiddleware(config: GenerateConfig): string {
  const { resourceNamePascal, resourceName } = config;
  
  return `import { Request, Response, NextFunction } from 'express';

export class ${resourceNamePascal}Middleware {
  validate${resourceNamePascal} = (req: Request, res: Response, next: NextFunction): void => {
    // Validation logic here
    next();
  };
}
`;
}
```

2. Register it in `src/generators/fileGenerator.ts`:

```typescript
import { generateMiddleware } from '../templates/middleware.template';

const generators: Record<string, (config: GenerateConfig) => string> = {
  model: generateModel,
  repository: generateRepository,
  service: generateService,
  controller: generateController,
  middleware: generateMiddleware  // Add this
};
```

3. Update the prompt in `src/commands/generate.ts`:

```typescript
{
  type: 'checkbox',
  name: 'components',
  message: 'Select components to generate:',
  choices: [
    { name: 'Model', value: 'model', checked: true },
    { name: 'Repository', value: 'repository', checked: true },
    { name: 'Service', value: 'service', checked: true },
    { name: 'Controller', value: 'controller', checked: true },
    { name: 'Middleware', value: 'middleware', checked: false }  // Add this
  ]
}
```

### Adding Support for a New ORM

1. Update the ORM type in template files:

```typescript
orm: 'knex' | 'mongodb' | 'typeorm'  // Add new ORM type
```

2. Create template generation functions for the new ORM in each template file:

```typescript
// In model.template.ts
function generateTypeORMModel(className: string, fields: Array<{ name: string; type: string }>): string {
  return `import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ${className} {
  @PrimaryGeneratedColumn()
  id: number;

  ${fields.map(f => `@Column()\n  ${f.name}: ${mapTypeToTS(f.type)};`).join('\n\n  ')}
}
`;
}

export function generateModel(config: GenerateConfig): string {
  const { resourceNamePascal, orm, fields } = config;

  if (orm === 'knex') {
    return generateKnexModel(resourceNamePascal, fields);
  } else if (orm === 'mongodb') {
    return generateMongoModel(resourceNamePascal, fields);
  } else if (orm === 'typeorm') {
    return generateTypeORMModel(resourceNamePascal, fields);
  }
  
  throw new Error(`Unsupported ORM: ${orm}`);
}
```

3. Do the same for repository, service, and controller templates.

### Customizing Templates

Templates are simple TypeScript functions that return strings. You can customize them by:

1. Adding conditional logic based on config
2. Adding helper functions for common patterns
3. Creating template partials for reusable code

Example:

```typescript
function generateModelFields(fields: Array<{ name: string; type: string }>): string {
  return fields
    .map(f => `  ${f.name}?: ${mapTypeToTS(f.type)};`)
    .join('\n');
}

function generateKnexModel(className: string, fields: Array<{ name: string; type: string }>): string {
  return `export interface ${className} {
  id?: number;
${generateModelFields(fields)}
  created_at?: Date;
  updated_at?: Date;
}`;
}
```

## Testing

### Manual Testing

Create a test directory and generate resources:

```bash
mkdir test-output
cd test-output
scaffold g user --orm knex --path ./src
scaffold g product --orm mongodb --path ./app
```

Verify:
- Files are created in correct locations
- Generated code is syntactically valid
- TypeScript compiles without errors
- All imports are correct

### Automated Testing (Future Enhancement)

Consider adding:

```bash
npm install -D jest @types/jest ts-jest
```

Create test files:

```typescript
// __tests__/stringUtils.test.ts
import { toPascalCase, toCamelCase } from '../src/utils/stringUtils';

describe('String Utils', () => {
  test('toPascalCase converts correctly', () => {
    expect(toPascalCase('user-profile')).toBe('UserProfile');
    expect(toPascalCase('user_profile')).toBe('UserProfile');
  });
  
  test('toCamelCase converts correctly', () => {
    expect(toCamelCase('user-profile')).toBe('userProfile');
    expect(toCamelCase('UserProfile')).toBe('userProfile');
  });
});
```

## Publishing to npm

### 1. Prepare for Publishing

Update `package.json`:
- Add proper `name`, `description`, `author`, `repository`, `keywords`
- Ensure `version` follows semantic versioning
- Add `LICENSE` file

### 2. Build and Test

```bash
npm run build
npm link
# Test the CLI thoroughly
```

### 3. Publish

```bash
# Login to npm
npm login

# Publish (dry run first)
npm publish --dry-run

# Actually publish
npm publish
```

### 4. Update After Publishing

When making updates:

```bash
# Update version
npm version patch  # or minor, or major

# Rebuild and publish
npm run build
npm publish
```

## Best Practices

1. **Keep templates simple**: Focus on generating clean, readable code
2. **Use interfaces**: Generate interfaces for better TypeScript support
3. **Follow conventions**: Stick to common Node.js/Express patterns
4. **Document everything**: Add JSDoc comments to generated code
5. **Test thoroughly**: Always test with real projects before publishing
6. **Version carefully**: Use semantic versioning correctly

## Common Issues and Solutions

### Issue: Generated code doesn't compile

**Solution**: Ensure all TypeScript types are correctly imported and mapped

### Issue: DI decorators not working

**Solution**: Verify `experimentalDecorators` is enabled in tsconfig.json

### Issue: CLI command not found after npm link

**Solution**: 
- Check `bin` field in package.json
- Ensure the CLI file has proper shebang: `#!/usr/bin/env node`
- Make sure the file is executable: `chmod +x dist/cli.js`

### Issue: Templates are generating invalid paths

**Solution**: Check the `getComponentPath` function in fileGenerator.ts

## Future Enhancements

Ideas for extending the CLI:

1. **Configuration file**: Support `.scaffoldrc` for project defaults
2. **Custom templates**: Allow users to provide their own templates
3. **Validation schemas**: Generate Joi/Yup validation schemas
4. **Test generation**: Auto-generate test files
5. **API documentation**: Generate Swagger/OpenAPI specs
6. **Database seeding**: Generate seed files
7. **Docker support**: Generate Dockerfile and docker-compose
8. **CI/CD**: Generate GitHub Actions or GitLab CI configs
9. **Authentication**: Generate auth middleware and JWT handling
10. **WebSocket support**: Generate socket.io handlers

## Contributing

If you want to contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

Follow the existing code style and conventions.
