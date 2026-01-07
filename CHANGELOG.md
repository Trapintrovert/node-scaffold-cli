# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-05

### Added
- Initial release of Node Scaffold CLI
- Support for generating OOP structure with Dependency Injection
- Knex (SQL) ORM support
- Mongoose ODM support (for MongoDB)
- Model generation with customizable fields
- Repository pattern implementation
- Service layer with business logic structure
- Express.js compatible controllers
- Interactive CLI prompts
- TypeScript support
- Barrel exports for generated modules
- Comprehensive documentation and examples

### Features
- Generate complete resource structure (Model, Repository, Service, Controller)
- Custom field definitions with type mapping
- Dependency Injection using tsyringe
- RESTful API patterns
- CRUD operations out of the box
- Validation placeholders
- Error handling structure
- Configurable output paths
- Choice between Knex/Objection (SQL) and Mongoose (MongoDB)

### Documentation
- README with installation and usage guide
- EXAMPLES.md with complete working examples
- DEVELOPMENT.md with contribution guidelines
- API documentation for all generated components

## [Unreleased]

### Planned
- TypeORM support
- Prisma support
- Test file generation
- Validation schema generation (Joi/Yup)
- OpenAPI/Swagger documentation generation
- Configuration file support (.scaffoldrc)
- Custom template support
- Authentication/Authorization middleware generation
- WebSocket handler generation
- GraphQL resolver generation
