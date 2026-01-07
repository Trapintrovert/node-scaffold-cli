# Node Scaffold CLI

> Generate production-ready Node.js code with OOP architecture, Dependency Injection, and support for Knex/Objection (SQL) or Mongoose (MongoDB).

## 🚀 Quick Start

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
# npm install express mongoose tsyringe reflect-metadata

# 4. Configure TypeScript (see Setup section)
# 5. Start coding!
```

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
├── models/           → Objection ORM (Knex) or Mongoose ODM models
├── repositories/     → Data access layer with CRUD
├── services/         → Business logic layer
└── controllers/      → Express.js request handlers
```

### Generated Code Example

**Model (Objection):**

```typescript
export class User extends Model {
  static tableName = 'users';
  static get jsonSchema() {
    /* validation */
  }
}
```

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

## 🛡️ Safety Features

### Duplicate File Protection

The CLI automatically checks if files already exist before creating them:

- **If file exists:** You'll be prompted to confirm overwrite
- **If you skip:** The file is preserved and marked as "skipped" in the summary
- **Summary report:** Shows which files were created, overwritten, or skipped

**Example output:**

```
✅ Created: src/models/user.model.ts
✏️  Overwritten: src/repositories/user.repository.ts
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
#    - Select components: ✓ Model ✓ Repository ✓ Service ✓ Controller
#    - Enter fields: name:string,email:string,age:number

# Step 6: If files already exist, you'll be asked to confirm overwrite

# Step 7: Done! Files created in src/models, src/repositories, etc.
#    - Summary shows: created, overwritten, and skipped files
#    - reflect-metadata import added automatically (if DI enabled)

# Step 8: Set up database and routes (see Setup section)
```

### Field Types

```bash
# When prompted for fields, use these types:
name:string,age:number,active:boolean,birth:date,tags:array,meta:object
```

### Incremental Building

```bash
# Build piece by piece
scaffold add model user
scaffold add repository user
scaffold add service user
scaffold add controller user
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
```

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

### ✅ TypeScript Ready

- Full type safety
- IntelliSense support
- Interfaces for everything

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

**With Dependency Injection:**

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

// Register routes
app.get('/api/users', userController.getAll);
// ... more routes
```

---

## 🆚 Generate vs Add

| Feature         | `generate`          | `add`                 |
| --------------- | ------------------- | --------------------- |
| **Use Case**    | New resource        | Single component      |
| **Interactive** | Select components   | Only for model fields |
| **Speed**       | Fast for full setup | Precise control       |
| **Output**      | Multiple files      | One file              |

**Tip:** Use `generate` to start, then `add` for additional components later!

---

## 🎨 Examples

### Example 1: Basic User CRUD

```bash
scaffold g user
# Fields: name:string,email:string,password:string
```

### Example 2: E-commerce Product

```bash
scaffold g product --orm mongoose
# Fields: title:string,price:number,inStock:boolean,images:array
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
