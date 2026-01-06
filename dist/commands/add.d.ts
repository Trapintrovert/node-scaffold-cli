interface AddOptions {
    orm: 'knex' | 'mongodb';
    path: string;
    di: boolean;
}
export declare function addComponent(componentType: string, resourceName: string, options: AddOptions): Promise<void>;
export {};
//# sourceMappingURL=add.d.ts.map