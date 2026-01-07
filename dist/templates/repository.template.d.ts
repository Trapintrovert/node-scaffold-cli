interface GenerateConfig {
    resourceName: string;
    resourceNamePascal: string;
    resourceNameCamel: string;
    orm: 'knex' | 'mongoose';
    basePath: string;
    useDI: boolean;
    components: string[];
    fields: Array<{
        name: string;
        type: string;
    }>;
}
export declare function generateRepository(config: GenerateConfig): string;
export {};
//# sourceMappingURL=repository.template.d.ts.map