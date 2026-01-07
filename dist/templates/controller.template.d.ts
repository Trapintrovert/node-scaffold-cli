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
export declare function generateController(config: GenerateConfig): string;
export {};
//# sourceMappingURL=controller.template.d.ts.map