# Quick Reference Guide

> **📌 Bookmark this page!** Everything you need to use the CLI.

## Table of Contents

1. [Command Syntax](#command-syntax)
2. [Options](#options-quick-reference)
3. [Common Commands](#common-commands)
4. [Field Types](#field-type-mappings)
5. [Generated Structure](#generated-file-structure)
6. [REST Endpoints](#rest-api-endpoints-generated)
7. [Setup Checklist](#setup-checklists)
8. [Troubleshooting](#troubleshooting-quick-fixes)

---

## Command Syntax

### Generate (Full Resource)

```bash
scaffold generate <resource> [options]
scaffold g <resource> [options]  # Short alias
```

### Add (Single Component)

```bash
scaffold add <component> <resource> [options]
scaffold a <component> <resource> [options]  # Short alias
```

Valid components: `model`, `repository`, `service`, `controller`

## Options Quick Reference

| Option    | Short | Description             | Default | Example         |
| --------- | ----- | ----------------------- | ------- | --------------- |
| `--orm`   | `-o`  | ORM type (knex/mongodb) | `knex`  | `--orm mongodb` |
| `--path`  | `-p`  | Base path for files     | `./src` | `--path ./app`  |
| `--no-di` |       | Disable DI              | `false` | `--no-di`       |

## Common Commands

### Generate (Full Resource)

```bash
# Basic generation (Knex with DI)
scaffold g user

# MongoDB without DI
scaffold g product --orm mongodb --no-di

# Custom path
scaffold g order --path ./app/modules

# Knex with custom path
scaffold g category --orm knex --path ./src/api
```

### Add (Single Component)

```bash
# Add model only
scaffold add model user

# Add service with MongoDB
scaffold add service product --orm mongodb

# Add controller without DI
scaffold add controller order --no-di

# Add repository with custom path
scaffold add repository customer --path ./app
```

## Field Type Mappings

| Input Type | TypeScript            | SQL (Knex) | MongoDB |
| ---------- | --------------------- | ---------- | ------- |
| `string`   | `string`              | VARCHAR    | String  |
| `number`   | `number`              | INTEGER    | Number  |
| `boolean`  | `boolean`             | BOOLEAN    | Boolean |
| `date`     | `Date`                | TIMESTAMP  | Date    |
| `object`   | `Record<string, any>` | JSON       | Mixed   |
| `array`    | `any[]`               | JSON       | Array   |

## Field Definition Examples

```bash
# Single field
name:string

# Multiple fields
name:string,email:string,age:number

# All supported types
name:string,age:number,active:boolean,birthdate:date,meta:object,tags:array
```

## Generated File Structure

```
src/
├── models/
│   ├── user.model.ts
│   └── product.model.ts
├── repositories/
│   ├── user.repository.ts
│   └── product.repository.ts
├── services/
│   ├── user.service.ts
│   └── product.service.ts
└── controllers/
    ├── user.controller.ts
    └── product.controller.ts
```

## REST API Endpoints (Generated)

| Method | Endpoint           | Controller Method | Description       |
| ------ | ------------------ | ----------------- | ----------------- |
| GET    | `/{resource}s`     | `getAll`          | Get all resources |
| GET    | `/{resource}s/:id` | `getById`         | Get one by ID     |
| POST   | `/{resource}s`     | `create`          | Create new        |
| PUT    | `/{resource}s/:id` | `update`          | Update existing   |
| DELETE | `/{resource}s/:id` | `delete`          | Delete by ID      |

## DI Setup Checklist

- [ ] Install: `npm install tsyringe reflect-metadata`
- [ ] Enable decorators in `tsconfig.json`
- [ ] Import `reflect-metadata` at app entry
- [ ] Register database connection
- [ ] Register repositories
- [ ] Register services
- [ ] Register controllers
- [ ] Resolve controllers in routes

## Knex Setup Checklist

- [ ] Install: `npm install knex pg`
- [ ] Create `knexfile.ts`
- [ ] Create database config
- [ ] Create migration files
- [ ] Run migrations: `npx knex migrate:latest`
- [ ] Register Knex instance in DI

## MongoDB Setup Checklist

- [ ] Install: `npm install mongoose`
- [ ] Create connection function
- [ ] Connect at app startup
- [ ] No migrations needed (Mongoose handles schema)
- [ ] Register models if needed

## File Naming Conventions

| Component  | File Pattern               | Class Name Pattern     |
| ---------- | -------------------------- | ---------------------- |
| Model      | `{resource}.model.ts`      | `{Resource}Model`      |
| Repository | `{resource}.repository.ts` | `{Resource}Repository` |
| Service    | `{resource}.service.ts`    | `{Resource}Service`    |
| Controller | `{resource}.controller.ts` | `{Resource}Controller` |

## String Case Conversions

| Input        | PascalCase  | camelCase   | kebab-case   | snake_case   |
| ------------ | ----------- | ----------- | ------------ | ------------ |
| user-profile | UserProfile | userProfile | user-profile | user_profile |
| user_profile | UserProfile | userProfile | user-profile | user_profile |
| userProfile  | UserProfile | userProfile | user-profile | user_profile |

## Common Workflows

### 1. Create New API Resource

```bash
scaffold g user --orm knex
# Select all components
# Add fields: name:string,email:string
# Create migration
# Register in DI
# Set up routes
```

### 2. MongoDB Resource

```bash
scaffold g product --orm mongodb
# Select all components
# Add fields: title:string,price:number,inStock:boolean
# Connect MongoDB
# Register in DI
# Set up routes
```

### 3. Standalone Service (No DB)

```bash
scaffold g email --no-di
# Select only Service
# Implement email logic
# Use directly without DB
```

## Troubleshooting Quick Fixes

| Problem             | Solution                                         |
| ------------------- | ------------------------------------------------ |
| Decorator errors    | Enable `experimentalDecorators` in tsconfig.json |
| Import errors       | Run `npm install` for dependencies               |
| DB connection fails | Check connection config and credentials          |
| Routes not working  | Ensure controller methods are bound properly     |
| Type errors         | Check ORM type definitions are installed         |

## Best Practices

✅ **DO:**

- Review generated code
- Add proper validation
- Implement error handling
- Write tests
- Add JSDoc comments
- Use transactions for multi-step operations

❌ **DON'T:**

- Use generated code in production without review
- Skip validation in services
- Forget error handling
- Hardcode sensitive data
- Mix business logic in controllers

## Quick Setup Script

```bash
# 1. Install CLI
npm install -g node-scaffold-cli

# 2. Generate resource
scaffold g user --orm knex

# 3. Install dependencies
npm install express knex pg tsyringe reflect-metadata
npm install -D @types/express @types/node typescript

# 4. Configure TypeScript
# (Add experimentalDecorators and emitDecoratorMetadata)

# 5. Set up database and DI
# (Create config files)

# 6. Create migrations
npx knex migrate:make create_users_table

# 7. Run migrations
npx knex migrate:latest

# 8. Set up routes
# (Configure Express app)

# 9. Start server
npm run dev
```

## Resources

- [Full Documentation](./README.md)
- [Complete Examples](./EXAMPLES.md)
- [Development Guide](./DEVELOPMENT.md)
- [Changelog](./CHANGELOG.md)

## Support

For issues: Open an issue on GitHub
For questions: Check documentation first
For features: Submit a feature request
