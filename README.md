# Node Scaffold CLI

> Generate production-ready Node.js code with OOP architecture, Dependency Injection, and support for Knex/Objection (SQL) or Mongoose (MongoDB).

## 🚀 Quick Start

### For New Projects

```bash
# 1. Install the CLI globally
npm install -g node-scaffold-cli

# 2. Generate a complete resource
scaffold g user

# 3. Install required dependencies (see Prerequisites below)
# For Knex/Objection (SQL):
npm install express objection knex pg tsyringe reflect-metadata
npm install -D @types/express @types/node typescript
# For Mongoose (MongoDB):
npm install express mongoose tsyringe reflect-metadata

# 4. Configure TypeScript (see Setup section)
# 5. Start coding!
```

### For Existing Projects

```bash
# Option 1: Install globally (recommended)
npm install -g node-scaffold-cli

# Option 2: Install as dev dependency in your project
npm install -D node-scaffold-cli
# Then use: npx scaffold g user

# Generate files matching your existing structure
scaffold g user --path ./src
# Or for nested structures:
scaffold g user --path ./src/modules
scaffold g product --path ./app/features
```

**Key Points:**

- Use `--path` to match your existing project structure
- Files are generated relative to the specified path
- CLI won't overwrite existing files without confirmation
- Works with any TypeScript/Node.js project structure

That's it! 🎉

> **Note:** Make sure to install the required dependencies for your chosen ORM and configure TypeScript before using the generated code.

---

## 📦 Prerequisites

Before using the generated code, you'll need to install dependencies based on your setup:

### Quick Dependency Reference

| Setup                  | Required Packages                                        |
| ---------------------- | -------------------------------------------------------- |
| **All Setups**         | `express`, `@types/express`, `@types/node`, `typescript` |
| **Knex (SQL)**         | `objection`, `knex`, `pg` (or `mysql2`, `sqlite3`, etc.) |
| **Mongoose (MongoDB)** | `mongoose`                                               |
| **With DI**            | `tsyringe`, `reflect-metadata`                           |

### Installation Commands

**Complete Setup (Knex + DI):**

```bash
npm install express objection knex pg tsyringe reflect-metadata
npm install -D @types/express @types/node typescript
```

**Complete Setup (Mongoose + DI):**

```bash
npm install express mongoose tsyringe reflect-metadata
npm install -D @types/express @types/node typescript
```

**Without DI (Knex):**

```bash
npm install express objection knex pg
npm install -D @types/express @types/node typescript
```

**Without DI (Mongoose):**

```bash
npm install express mongoose
npm install -D @types/express @types/node typescript
```

### TypeScript Configuration

Your `tsconfig.json` must include these options for DI to work:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

> **Note:** The CLI automatically adds `reflect-metadata` import when DI is enabled, but you still need to install the package.

See the [Setup After Generation](#-setup-after-generation) section for complete TypeScript configuration examples.

---

## 📋 What Does It Generate?

```
src/
├── models/
│   ├── user.model.ts
│   ├── product.model.ts
│   └── index.ts          → Barrel exports (auto-generated)
├── repositories/
│   ├── user.repository.ts
│   ├── product.repository.ts
│   └── index.ts          → Barrel exports (auto-generated)
├── services/
│   ├── user.service.ts
│   ├── product.service.ts
│   └── index.ts          → Barrel exports (auto-generated)
├── controllers/
│   ├── user.controller.ts
│   ├── product.controller.ts
│   └── index.ts          → Barrel exports (auto-generated)
└── routers/
    ├── user.router.ts
    ├── product.router.ts
    └── index.ts          → Barrel exports (auto-generated)
```

**Barrel Exports:** Each folder automatically gets an `index.ts` file that exports all components, enabling clean imports like `import { UserModel, ProductModel } from './models'`.

### Generated Code Example

**Model (Objection):**

```typescript
export class User extends Model {
  static tableName = 'users';

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        // Add your fields here
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
    };
  }
}
```

> **Note:** Models are generated empty by default. Add your fields manually after generation.

**Repository:**

```typescript
export class UserRepository {
  async findById(id: number): Promise<User | undefined> {}
  async findAll(): Promise<User[]> {}
  async create(data: Partial<User>): Promise<User> {}
  // ... more methods
}
```

**Service:**

```typescript
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getById(id: number): Promise<User | null> {}
  async create(data: Partial<User>): Promise<User> {}
  // ... with validation
}
```

**Controller:**

```typescript
export class UserController {
  getAll = async (req: Request, res: Response) => {};
  getById = async (req: Request, res: Response) => {};
  create = async (req: Request, res: Response) => {};
  // ... all CRUD endpoints
}
```

**Router:**

```typescript
export class UserRouter {
  public router: Router;

  constructor(private userController: UserController) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get('/', this.userController.getAll);
    this.router.get('/:id', this.userController.getById);
    this.router.post('/', this.userController.create);
    this.router.put('/:id', this.userController.update);
    this.router.delete('/:id', this.userController.delete);
  }
}
```

---

## 📖 Two Commands

### 1. `generate` - Create Full Resource

Generate all components at once (interactive prompts):

```bash
scaffold generate user
scaffold g product --orm mongoose
```

**When to use:** Starting a new resource from scratch

### 2. `add` - Create Single Component

Generate one component at a time:

```bash
scaffold add model user
scaffold add service product
scaffold a controller order
```

**When to use:** Adding to existing resources or granular control

---

## ⚙️ Options

| Option        | Values             | Default    | Description                                         |
| ------------- | ------------------ | ---------- | --------------------------------------------------- |
| `--orm` `-o`  | `knex`, `mongoose` | `knex`     | ORM/ODM (knex=Objection ORM, mongoose=Mongoose ODM) |
| `--path` `-p` | any path           | `./src`    | Output directory                                    |
| `--no-di`     | -                  | DI enabled | Disable dependency injection                        |

### Using `--path` in Existing Projects

The `--path` option is crucial for integrating with existing projects. It determines where files will be generated:

```bash
# Standard structure (default)
scaffold g user --path ./src
# Generates: src/models/, src/repositories/, etc.

# Nested module structure
scaffold g user --path ./src/modules/users
# Generates: src/modules/users/models/, src/modules/users/repositories/, etc.

# Feature-based structure
scaffold g product --path ./app/features/products
# Generates: app/features/products/models/, etc.

# Monorepo structure
scaffold g order --path ./packages/api/src
# Generates: packages/api/src/models/, etc.
```

**Tips:**

- Always run the command from your project root
- Use relative paths (e.g., `./src`, `./app`)
- The CLI creates the directory structure if it doesn't exist
- Generated files use relative imports based on the path structure

## 🛡️ Safety Features

### Duplicate File Protection

The CLI automatically checks if files already exist before creating them:

- **If file exists:** You'll be prompted to confirm overwrite
- **If you skip:** The file is preserved and marked as "skipped" in the summary
- **Summary report:** Shows which files were created, overwritten, or skipped

**Example output:**

```
✅ Created: src/models/user.model.ts
📦 Created models/index.ts with barrel export
✏️  Overwritten: src/repositories/user.repository.ts
📦 Updated repositories/index.ts with new export
⏭️  Skipped: src/services/user.service.ts
```

### Automatic DI Setup

When generating with DI enabled (`--di` is default):

- **Auto-detects** entry point files (`index.ts`, `app.ts`, `main.ts`, `server.ts`, `config/container.ts`)
- **Auto-adds** `import 'reflect-metadata';` if missing
- **Skips** if already imported
- **Shows message** when import is added

**Note:** You still need to install: `npm install reflect-metadata`

---

## 💡 Common Usage

### Complete Workflow

```bash
# Step 1: Install CLI (if not already installed)
npm install -g node-scaffold-cli

# Step 2: Install project dependencies (see Prerequisites above)
npm install express objection knex pg tsyringe reflect-metadata
npm install -D @types/express @types/node typescript

# Step 3: Configure TypeScript (see Setup section)
# Add experimentalDecorators and emitDecoratorMetadata to tsconfig.json

# Step 4: Generate resource
scaffold g user --orm knex

# Step 5: You'll be prompted:
#    - Select components: ✓ Model ✓ Repository ✓ Service ✓ Controller (Router optional)

# Step 6: If files already exist, you'll be asked to confirm overwrite

# Step 7: Done! Files created in src/models, src/repositories, etc.
#    - Summary shows: created, overwritten, and skipped files
#    - reflect-metadata import added automatically (if DI enabled)
#    - index.ts barrel export files created/updated automatically

# Step 8: Set up database and routes (see Setup section)
```

### Adding Fields to Models

Models are generated empty by default. Add fields manually after generation:

```typescript
// Example: Adding fields to a Knex/Objection model
export class User extends Model {
  static tableName = 'users';

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
        email: { type: 'string' },
        age: { type: 'number' },
        // Add your fields here
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
    };
  }
}
```

### Incremental Building

```bash
# Build piece by piece
scaffold add model user
scaffold add repository user
scaffold add service user
scaffold add controller user
scaffold add router user
```

### Multiple Resources

```bash
# Each resource in its own files
scaffold g user
scaffold g product
scaffold g order

# Result:
# src/models/user.model.ts, product.model.ts, order.model.ts
# src/repositories/user.repository.ts, product.repository.ts, ...
# Each folder has index.ts with barrel exports
```

### Clean Imports with Barrel Exports

The CLI automatically creates `index.ts` files in each folder, enabling clean imports:

```typescript
// Instead of individual imports:
import { UserModel } from './models/user.model';
import { ProductModel } from './models/product.model';

// Use barrel exports:
import { UserModel, ProductModel } from './models';
import { UserRepository, ProductRepository } from './repositories';
import { UserService, ProductService } from './services';
import { UserController, ProductController } from './controllers';
import { UserRouter, ProductRouter } from './routers';
```

**Note:** Barrel exports are automatically created/updated when you generate files. No manual maintenance needed!

---

## 📚 Documentation

- **[Quick Reference](./QUICKREF.md)** ⭐ - Command cheatsheet and examples
- **[Add Command Guide](./ADD_COMMAND.md)** - Detailed guide for `add` command
- **[Complete Examples](./EXAMPLES.md)** - Full working examples with setup
- **[Architecture](./ARCHITECTURE.md)** - Understanding the generated structure
- **[Development Guide](./DEVELOPMENT.md)** - Extending and customizing

---

## 🎯 Key Features

### ✅ Clean Architecture

- **Model** - Data structure (Objection ORM for SQL, Mongoose ODM for MongoDB)
- **Repository** - Database queries
- **Service** - Business logic + validation
- **Controller** - HTTP handlers
- **Router** - Express route definitions

### ✅ TypeScript Ready

- Full type safety
- IntelliSense support
- Type-safe classes and methods

### ✅ Dependency Injection

- Optional DI with tsyringe
- Easy testing with mocks
- Clean dependencies

### ✅ Production Patterns

- RESTful endpoints
- Error handling
- Validation placeholders
- CRUD operations

### ✅ Smart File Management

- **Duplicate detection** - Prompts before overwriting existing files
- **Automatic setup** - Adds `reflect-metadata` import when DI is enabled
- **Barrel exports** - Automatically creates/updates `index.ts` files in each folder for clean imports
- **Safe operations** - Shows summary of created, overwritten, and skipped files

---

## 🔧 Setup After Generation

### Step 1: Install Dependencies

**For Knex (SQL) Projects:**

```bash
npm install express objection knex pg tsyringe reflect-metadata
npm install -D @types/express @types/node typescript
```

**For Mongoose (MongoDB) Projects:**

```bash
npm install express mongoose tsyringe reflect-metadata
npm install -D @types/express @types/node typescript
```

**Without Dependency Injection:**

```bash
# Knex
npm install express objection knex pg
npm install -D @types/express @types/node typescript

# MongoDB
npm install express mongoose
npm install -D @types/express @types/node typescript
```

### Step 2: Configure TypeScript

Create or update your `tsconfig.json`:

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

> **Important:** `experimentalDecorators` and `emitDecoratorMetadata` are required for Dependency Injection to work.

### Step 3: Database Setup

**For Knex (SQL):**

```bash
# 1. Create database config (see EXAMPLES.md)
# 2. Create migration
npx knex migrate:make create_users_table

# 3. Run migrations
npx knex migrate:latest
```

**For Mongoose (MongoDB):**

```bash
# 1. Connect to MongoDB using Mongoose (see EXAMPLES.md)
# 2. No migrations needed!
```

### Step 4: Setup DI Container (If Using DI)

**✨ Automatic Setup:** When you generate files with DI enabled, the CLI automatically:

- Detects your entry point file (`index.ts`, `app.ts`, `main.ts`, `server.ts`, or `config/container.ts`)
- Adds `import 'reflect-metadata';` at the top if it's missing
- Skips adding if it's already imported

**Manual Setup (if automatic detection fails):**

```typescript
// src/config/container.ts
import 'reflect-metadata'; // ← Added automatically by CLI
import { container } from 'tsyringe';
import { createDatabase } from './database';
import { UserRepository } from '../repositories/user.repository';
import { UserService } from '../services/user.service';
import { UserController } from '../controllers/user.controller';

// Register database connection
const db = createDatabase();
container.register('Database', { useValue: db });

// Register components
container.register(UserRepository, { useClass: UserRepository });
container.register(UserService, { useClass: UserService });
container.register(UserController, { useClass: UserController });
```

> **Note:** You still need to install: `npm install tsyringe reflect-metadata`

### Step 5: Register Routes

**With Router (Recommended):**

```typescript
// src/server.ts or src/app.ts
import express from 'express';
import { container } from 'tsyringe';
import { UserRouter } from './routers/user.router';

const app = express();
app.use(express.json());

// Resolve router from DI container
const userRouter = container.resolve(UserRouter);

// Register router
app.use('/api/users', userRouter.router);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

**With Dependency Injection (Direct Controller):**

```typescript
// src/server.ts or src/app.ts
import express from 'express';
import { container } from 'tsyringe';
import { UserController } from './controllers/user.controller';

const app = express();
app.use(express.json());

// Resolve controller from DI container
const userController = container.resolve(UserController);

// Register routes
app.get('/api/users', userController.getAll);
app.get('/api/users/:id', userController.getById);
app.post('/api/users', userController.create);
app.put('/api/users/:id', userController.update);
app.delete('/api/users/:id', userController.delete);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

**Without Dependency Injection:**

```typescript
// src/server.ts
import express from 'express';
import { UserRouter } from './routers/user.router';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';
import { createDatabase } from './config/database';

const app = express();
app.use(express.json());

// Manual instantiation
const db = createDatabase();
const userRepository = new UserRepository(db);
const userService = new UserService(userRepository);
const userController = new UserController(userService);
const userRouter = new UserRouter(userController);

// Register router
app.use('/api/users', userRouter.router);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

---

## 🆚 Generate vs Add

| Feature         | `generate`          | `add`            |
| --------------- | ------------------- | ---------------- |
| **Use Case**    | New resource        | Single component |
| **Interactive** | Select components   | No prompts       |
| **Speed**       | Fast for full setup | Precise control  |
| **Output**      | Multiple files      | One file         |

**Tip:** Use `generate` to start, then `add` for additional components later!

---

## 🎨 Examples

### Example 1: Basic User CRUD

```bash
scaffold g user
# Models are generated empty - add fields manually after generation
```

### Example 2: E-commerce Product

```bash
scaffold g product --orm mongoose
# Models are generated empty - add fields manually after generation
```

### Example 3: Adding Admin Service

```bash
# You already have user resource
scaffold add service admin-user
# Customize for admin-specific logic
```

### Example 4: Multi-tenant App

```bash
scaffold g tenant --orm knex
scaffold g user --orm knex
scaffold g project --orm knex
# Each gets full CRUD structure
```

### Example 5: Using in Existing Project

**Scenario:** You have an existing Express API with this structure:

```
my-api/
├── src/
│   ├── config/
│   ├── middleware/
│   └── routes/
└── package.json
```

**Add a new resource:**

```bash
# From project root
scaffold g user --path ./src
# Generates: src/models/, src/repositories/, src/services/, src/controllers/, src/routers/

# If you prefer a different structure
scaffold g product --path ./src/modules/products
# Generates: src/modules/products/models/, etc.
```

**Add to existing resource:**

```bash
# You already have a user model, add other components
scaffold add repository user --path ./src
scaffold add service user --path ./src
scaffold add controller user --path ./src
scaffold add router user --path ./src
```

### Example 6: Monorepo Structure

```bash
# In a monorepo with packages/api/src structure
scaffold g user --path ./packages/api/src
# Files generated in packages/api/src/models/, etc.
```

### Example 7: Feature-Based Architecture

```bash
# Feature-based structure
scaffold g user --path ./src/features/users
scaffold g product --path ./src/features/products
# Each feature has its own models, repositories, etc.
```

### Example 5: Using in Existing Project

**Scenario:** You have an existing Express API with this structure:

```
my-api/
├── src/
│   ├── config/
│   ├── middleware/
│   └── routes/
└── package.json
```

**Add a new resource:**

```bash
# From project root
scaffold g user --path ./src
# Generates: src/models/, src/repositories/, src/services/, src/controllers/, src/routers/

# If you prefer a different structure
scaffold g product --path ./src/modules/products
# Generates: src/modules/products/models/, etc.
```

**Add to existing resource:**

```bash
# You already have a user model, add other components
scaffold add repository user --path ./src
scaffold add service user --path ./src
scaffold add controller user --path ./src
scaffold add router user --path ./src
```

### Example 6: Monorepo Structure

```bash
# In a monorepo with packages/api/src structure
scaffold g user --path ./packages/api/src
# Files generated in packages/api/src/models/, etc.
```

### Example 7: Feature-Based Architecture

```bash
# Feature-based structure
scaffold g user --path ./src/features/users
scaffold g product --path ./src/features/products
# Each feature has its own models, repositories, etc.
```

---

## 🔍 Troubleshooting

### Common Issues

**"Cannot find module 'express'" or similar errors:**

- Make sure you've installed all required dependencies (see [Prerequisites](#-prerequisites))
- Run `npm install` in your project directory

**"Decorator metadata is not enabled" or DI not working:**

- Ensure `experimentalDecorators: true` and `emitDecoratorMetadata: true` are in your `tsconfig.json`
- Make sure `reflect-metadata` is installed: `npm install reflect-metadata`
- The CLI adds the import automatically, but you need to install the package

**"File already exists" prompt:**

- This is normal! The CLI protects you from accidental overwrites
- Choose "Yes" to overwrite, or "No" to skip and keep your existing file

**TypeScript compilation errors:**

- Make sure you have `@types/express` and `@types/node` installed
- Check that your `tsconfig.json` includes the required compiler options

**Database connection issues:**

- For Knex/Objection: Ensure your database driver is installed (`pg`, `mysql2`, etc.)
- For Mongoose: Ensure `mongoose` is installed
- See [EXAMPLES.md](./EXAMPLES.md) for complete database setup examples

### Getting Help

- **Quick Reference:** Check [QUICKREF.md](./QUICKREF.md) for command examples
- **Full Examples:** See [EXAMPLES.md](./EXAMPLES.md) for complete setup guides
- **Issues:** Report problems on GitHub
- **Questions:** Check documentation files first

---

## 🤝 Support

- **Issues:** Report on GitHub
- **Questions:** Check [QUICKREF.md](./QUICKREF.md) first
- **Examples:** See [EXAMPLES.md](./EXAMPLES.md)

---

## 📝 License

MIT

---

## 🌟 Pro Tips

1. **Start with `generate`** for new resources
2. **Use `add`** for granular control
3. **Check [QUICKREF.md](./QUICKREF.md)** for quick commands
4. **Read [EXAMPLES.md](./EXAMPLES.md)** for full setup
5. **Customize generated code** - it's starter code!
6. **Safe to re-run** - CLI checks for duplicates and asks before overwriting
7. **DI setup is automatic** - `reflect-metadata` import is handled for you

---

**Need more details?** → Check out **[QUICKREF.md](./QUICKREF.md)** for command reference and examples!
