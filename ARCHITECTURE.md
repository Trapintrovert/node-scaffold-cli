# Architecture Overview

## Project Structure

```
your-project/
├── src/
│   ├── models/              ← All model files
│   │   ├── user.model.ts
│   │   ├── product.model.ts
│   │   └── order.model.ts
│   │
│   ├── repositories/        ← All repository files
│   │   ├── user.repository.ts
│   │   ├── product.repository.ts
│   │   └── order.repository.ts
│   │
│   ├── services/            ← All service files
│   │   ├── user.service.ts
│   │   ├── product.service.ts
│   │   └── order.service.ts
│   │
│   └── controllers/         ← All controller files
│       ├── user.controller.ts
│       ├── product.controller.ts
│       └── order.controller.ts
│
├── migrations/              ← Database migrations (Knex)
│   └── 20240101_create_users_table.ts
│
└── config/
    ├── database.ts          ← Database configuration
    └── container.ts         ← DI container setup
```

## Layer Architecture

```
┌─────────────────────────────────────────────────────┐
│                   HTTP Request                       │
│                        ↓                             │
│  ┌──────────────────────────────────────────────┐  │
│  │            Controller Layer                    │  │
│  │  • Handle HTTP requests/responses             │  │
│  │  • Validate request data                      │  │
│  │  • Call service methods                       │  │
│  │  • Return formatted responses                 │  │
│  │                                                │  │
│  │  Example: user.controller.ts                  │  │
│  └─────────────────┬────────────────────────────┘  │
│                    ↓                                 │
│  ┌──────────────────────────────────────────────┐  │
│  │             Service Layer                      │  │
│  │  • Business logic                             │  │
│  │  • Validation                                 │  │
│  │  • Orchestrate multiple repositories          │  │
│  │  • Transaction management                     │  │
│  │                                                │  │
│  │  Example: user.service.ts                     │  │
│  └─────────────────┬────────────────────────────┘  │
│                    ↓                                 │
│  ┌──────────────────────────────────────────────┐  │
│  │           Repository Layer                     │  │
│  │  • Data access logic                          │  │
│  │  • Database queries                           │  │
│  │  • CRUD operations                            │  │
│  │  • Abstract database implementation           │  │
│  │                                                │  │
│  │  Example: user.repository.ts                  │  │
│  └─────────────────┬────────────────────────────┘  │
│                    ↓                                 │
│  ┌──────────────────────────────────────────────┐  │
│  │              Model Layer                       │  │
│  │  • Data structures                            │  │
│  │  • Type definitions                           │  │
│  │  • Entity interfaces                          │  │
│  │                                                │  │
│  │  Example: user.model.ts                       │  │
│  └─────────────────┬────────────────────────────┘  │
│                    ↓                                 │
│  ┌──────────────────────────────────────────────┐  │
│  │              Database                          │  │
│  │  • PostgreSQL / MySQL (Knex)                  │  │
│  │  • MongoDB (Mongoose)                         │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

## Data Flow Example: Create User

```
1. Client → POST /api/users
   {
     "name": "John Doe",
     "email": "john@example.com"
   }

2. Express Router → UserController.create()

3. UserController
   ↓
   Validates request body
   ↓
   Calls UserService.create(data)

4. UserService
   ↓
   Applies business rules
   ↓
   Validates email format
   ↓
   Calls UserRepository.create(data)

5. UserRepository
   ↓
   Constructs SQL/NoSQL query
   ↓
   Executes INSERT operation
   ↓
   Returns created user object

6. Flow back up:
   Repository → Service → Controller → Response
   
7. Client ← 201 Created
   {
     "success": true,
     "data": {
       "id": 1,
       "name": "John Doe",
       "email": "john@example.com"
     }
   }
```

## Dependency Injection Flow

```
┌───────────────────────────────────────┐
│      Application Bootstrap            │
│                                       │
│  1. Import 'reflect-metadata'         │
│  2. Create Database Connection        │
│  3. Register Dependencies             │
│                                       │
│  container.register('Database', db)   │
│  container.register(UserRepository)   │
│  container.register(UserService)      │
│  container.register(UserController)   │
└──────────────┬────────────────────────┘
               ↓
┌───────────────────────────────────────┐
│         DI Container                  │
│                                       │
│  Manages dependencies:                │
│  • Database → UserRepository          │
│  • UserRepository → UserService       │
│  • UserService → UserController       │
└──────────────┬────────────────────────┘
               ↓
┌───────────────────────────────────────┐
│      Route Registration               │
│                                       │
│  const userCtrl = container.resolve(  │
│    UserController                     │
│  );                                   │
│                                       │
│  app.get('/users', userCtrl.getAll);  │
│  app.post('/users', userCtrl.create); │
└───────────────────────────────────────┘
```

## File Relationships

### For a "User" resource:

```
user.model.ts
    ↑ imported by
user.repository.ts
    ↑ imported by
user.service.ts
    ↑ imported by
user.controller.ts
    ↑ used by
Express Routes (server.ts)
```

### Import Structure:

**user.controller.ts**
```typescript
import { UserService } from '../services/user.service';
```

**user.service.ts**
```typescript
import { User } from '../models/user.model';
import { UserRepository } from '../repositories/user.repository';
```

**user.repository.ts**
```typescript
import { User } from '../models/user.model';
```

## Multiple Resources Example

When you generate multiple resources:

```bash
scaffold g user
scaffold g product
scaffold g order
```

You get:

```
src/
├── models/
│   ├── user.model.ts       ← User entity
│   ├── product.model.ts    ← Product entity
│   └── order.model.ts      ← Order entity
│
├── repositories/
│   ├── user.repository.ts     ← User data access
│   ├── product.repository.ts  ← Product data access
│   └── order.repository.ts    ← Order data access
│
├── services/
│   ├── user.service.ts        ← User business logic
│   ├── product.service.ts     ← Product business logic
│   └── order.service.ts       ← Order business logic
│                                (Can use UserRepo + ProductRepo)
│
└── controllers/
    ├── user.controller.ts     ← /api/users endpoints
    ├── product.controller.ts  ← /api/products endpoints
    └── order.controller.ts    ← /api/orders endpoints
```

## Benefits of This Structure

1. **Separation of Concerns**: Each layer has a specific responsibility
2. **Testability**: Easy to mock dependencies for unit testing
3. **Scalability**: Add new resources without affecting existing ones
4. **Maintainability**: Changes in one layer don't affect others
5. **Flexibility**: Easy to swap ORM or database
6. **Reusability**: Services can use multiple repositories
7. **Clean Code**: Clear dependencies and data flow

## Common Patterns

### Service Using Multiple Repositories

```typescript
// order.service.ts
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private productRepository: ProductRepository,
    private userRepository: UserRepository
  ) {}

  async createOrder(userId: number, productIds: number[]) {
    // Validate user exists
    const user = await this.userRepository.findById(userId);
    
    // Validate products exist
    const products = await this.productRepository.findByIds(productIds);
    
    // Create order
    const order = await this.orderRepository.create({
      userId,
      products,
      total: this.calculateTotal(products)
    });
    
    return order;
  }
}
```

### Repository with Custom Queries

```typescript
// user.repository.ts
export class UserRepository {
  // ... CRUD methods ...
  
  async findByEmail(email: string): Promise<User | null> {
    return this.db('users').where({ email }).first();
  }
  
  async findActiveUsers(): Promise<User[]> {
    return this.db('users').where({ isActive: true });
  }
}
```

This structure scales from small projects to enterprise applications!
