interface GenerateOptions {
    orm: 'knex' | 'mongodb';
    path: string;
    di: boolean;
}
export declare function generateResource(resourceName: string, options: GenerateOptions): Promise<void>;
export {};
//# sourceMappingURL=generate.d.ts.map