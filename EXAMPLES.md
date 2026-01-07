# Example Usage Guide

## Complete Example: Building a User Management API

### Step 1: Generate the User Resource

```bash
scaffold g user --orm knex
```

When prompted:
- Select all components: Model, Repository, Service, Controller
- Enter fields: `name:string,email:string,age:number,isActive:boolean`

This generates:
```
src/
├── models/
│   └── user.model.ts
├── repositories/
│   └── user.repository.ts
├── services/
│   └── user.service.ts
└── controllers/
    └── user.controller.ts
```

### Step 2: Set Up Your Project

#### Install Dependencies

```bash
npm install express knex pg tsyringe reflect-metadata
npm install -D @types/express @types/node typescript
```

#### Configure TypeScript (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### Step 3: Configure Database (src/config/database.ts)

```typescript
import knex, { Knex } from 'knex';

export function createDatabase(): Knex {
  return knex({
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'myapp'
    },
    pool: {
      min: 2,
      max: 10
    }
  });
}
```

### Step 4: Set Up Dependency Injection (src/config/container.ts)

```typescript
import 'reflect-metadata';
import { container } from 'tsyringe';
import { createDatabase } from './database';
import { UserRepository } from '../user/repositories/user.repository';
import { UserService } from '../user/services/user.service';
import { UserController } from '../user/controllers/user.controller';

export function setupContainer() {
  // Register database
  const db = createDatabase();
  container.register('Database', { useValue: db });

  // Register repositories
  container.register(UserRepository, { useClass: UserRepository });

  // Register services
  container.register(UserService, { useClass: UserService });

  // Register controllers
  container.register(UserController, { useClass: UserController });

  return container;
}
```

### Step 5: Create Database Migration

Create `migrations/20240101000000_create_users_table.ts`:

```typescript
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name', 255).notNullable();
    table.string('email', 255).notNullable().unique();
    table.integer('age');
    table.boolean('isActive').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users');
}
```

### Step 6: Set Up Express Server (src/server.ts)

```typescript
import express, { Express, Request, Response, NextFunction } from 'express';
import { setupContainer } from './config/container';
import { UserController } from './user/controllers/user.controller';

const app: Express = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up DI container
const container = setupContainer();

// Get controller instances
const userController = container.resolve(UserController);

// Routes
app.get('/api/users', userController.getAll);
app.get('/api/users/:id', userController.getById);
app.post('/api/users', userController.create);
app.put('/api/users/:id', userController.update);
app.delete('/api/users/:id', userController.delete);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
```

### Step 7: Add Custom Validation to Service

Edit `src/user/services/user.service.ts`:

```typescript
private validateCreateData(data: Partial<User>): void {
  if (!data.name || data.name.trim().length === 0) {
    throw new Error('Name is required');
  }
  
  if (!data.email || !this.isValidEmail(data.email)) {
    throw new Error('Valid email is required');
  }
  
  if (data.age !== undefined && (data.age < 0 || data.age > 150)) {
    throw new Error('Age must be between 0 and 150');
  }
}

private validateUpdateData(data: Partial<User>): void {
  if (data.name !== undefined && data.name.trim().length === 0) {
    throw new Error('Name cannot be empty');
  }
  
  if (data.email !== undefined && !this.isValidEmail(data.email)) {
    throw new Error('Invalid email format');
  }
  
  if (data.age !== undefined && (data.age < 0 || data.age > 150)) {
    throw new Error('Age must be between 0 and 150');
  }
}

private isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
```

### Step 8: Run Database Migrations

Create `knexfile.ts`:

```typescript
import { Knex } from 'knex';

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'myapp'
    },
    migrations: {
      directory: './migrations',
      extension: 'ts'
    }
  }
};

export default config;
```

Run migrations:

```bash
npx knex migrate:latest
```

### Step 9: Test the API

Start the server:

```bash
npm run build
node dist/server.js
```

Test endpoints:

```bash
# Create a user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","age":30,"isActive":true}'

# Get all users
curl http://localhost:3000/api/users

# Get user by ID
curl http://localhost:3000/api/users/1

# Update user
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"age":31}'

# Delete user
curl -X DELETE http://localhost:3000/api/users/1
```

## Mongoose (MongoDB) Example

For MongoDB using Mongoose ODM, follow similar steps but:

1. Generate with Mongoose ODM:
```bash
scaffold g product --orm mongoose
```

2. Install Mongoose dependencies:
```bash
npm install mongoose
npm install -D @types/mongoose
```

3. Configure Mongoose connection:
```typescript
import mongoose from 'mongoose';

export async function connectDatabase() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/myapp');
  console.log('Connected to MongoDB');
}
```

4. No migrations needed - Mongoose handles schema automatically!

## Advanced: Multiple Resources

Generate multiple related resources:

```bash
scaffold g user --orm knex
scaffold g post --orm knex
scaffold g comment --orm knex
```

Then add relationships in the models and repositories as needed.
