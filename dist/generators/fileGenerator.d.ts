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
export interface GenerationResult {
    created: string[];
    skipped: string[];
    overwritten: string[];
}
export declare function generateFiles(config: GenerateConfig): Promise<GenerationResult>;
export {};
//# sourceMappingURL=fileGenerator.d.ts.map