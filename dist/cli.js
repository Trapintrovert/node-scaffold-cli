#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const generate_1 = require("./commands/generate");
const add_1 = require("./commands/add");
const chalk_1 = __importDefault(require("chalk"));
const program = new commander_1.Command();
program
    .name('scaffold')
    .description('CLI tool to generate OOP structure with DI for Node.js projects')
    .version('1.0.0');
program
    .command('generate <resource>')
    .alias('g')
    .description('Generate a new resource (model, controller, repository, service, router)')
    .option('-o, --orm <type>', 'ORM/ODM type (knex for Objection ORM, mongoose for Mongoose ODM)', 'knex')
    .option('-p, --path <path>', 'Base path for generated files', './src')
    .option('--no-di', 'Generate without dependency injection')
    .action(async (resource, options) => {
    try {
        await (0, generate_1.generateResource)(resource, options);
    }
    catch (error) {
        console.error(chalk_1.default.red('Error:'), error instanceof Error ? error.message : error);
        process.exit(1);
    }
});
program
    .command('add <component> <resource>')
    .alias('a')
    .description('Add a single component (model, repository, service, controller, or router) for a resource')
    .option('-o, --orm <type>', 'ORM/ODM type (knex for Objection ORM, mongoose for Mongoose ODM)', 'knex')
    .option('-p, --path <path>', 'Base path for generated files', './src')
    .option('--no-di', 'Generate without dependency injection')
    .action(async (component, resource, options) => {
    try {
        await (0, add_1.addComponent)(component, resource, options);
    }
    catch (error) {
        console.error(chalk_1.default.red('Error:'), error instanceof Error ? error.message : error);
        process.exit(1);
    }
});
program.parse(process.argv);
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
//# sourceMappingURL=cli.js.map