# Node Scaffold CLI

> Generate production-ready Node.js code with OOP architecture, Dependency Injection, and support for Knex (SQL) or MongoDB.

## 🚀 Quick Start

```bash
# Install globally
npm install -g node-scaffold-cli

# Generate a complete resource
scaffold g user

# Or add a single component
scaffold a model product
```

That's it! 🎉

---

## 📋 What Does It Generate?

```
src/
├── models/           → Objection (Knex) or Mongoose models
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
scaffold g product --orm mongodb
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

| Option        | Values            | Default    | Description                  |
| ------------- | ----------------- | ---------- | ---------------------------- |
| `--orm` `-o`  | `knex`, `mongodb` | `knex`     | Database ORM                 |
| `--path` `-p` | any path          | `./src`    | Output directory             |
| `--no-di`     | -                 | DI enabled | Disable dependency injection |

---

## 💡 Common Usage

### Complete Workflow

```bash
# 1. Generate resource
scaffold g user --orm knex

# 2. You'll be prompted:
#    - Select components: ✓ Model ✓ Repository ✓ Service ✓ Controller
#    - Enter fields: name:string,email:string,age:number

# 3. Done! Files created in src/models, src/repositories, etc.
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

- **Model** - Data structure (Objection or Mongoose)
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

---

## 🔧 Setup After Generation

### For Knex (SQL):

```bash
# 1. Install dependencies
npm install objection knex pg

# 2. Create database config
# See EXAMPLES.md for full setup

# 3. Create migration
npx knex migrate:make create_users_table

# 4. Run migrations
npx knex migrate:latest
```

### For MongoDB:

```bash
# 1. Install mongoose
npm install mongoose

# 2. Connect to MongoDB
# See EXAMPLES.md for full setup

# 3. No migrations needed!
```

### Setup DI Container:

```typescript
// src/config/container.ts
import 'reflect-metadata';
import { container } from 'tsyringe';

// Register your components
container.register('Database', { useValue: db });
container.register(UserRepository, { useClass: UserRepository });
container.register(UserService, { useClass: UserService });
```

### Register Routes:

```typescript
// src/server.ts
import { container } from 'tsyringe';
import { UserController } from './controllers/user.controller';

const userController = container.resolve(UserController);

app.get('/api/users', userController.getAll);
app.post('/api/users', userController.create);
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
scaffold g product --orm mongodb
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

---

**Need more details?** → Check out **[QUICKREF.md](./QUICKREF.md)** for command reference and examples!
