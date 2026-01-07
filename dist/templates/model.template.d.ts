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
export declare function generateModel(config: GenerateConfig): string;
export {};
//# sourceMappingURL=model.template.d.ts.map