export type Thunk<T> = () => T;

export type FieldsConfig<DbShape, Shape = DbShape> = {
  [K in keyof Shape]: {
    fieldName: keyof DbShape;
    model?: BuiltModel<any>;
    resolve?: (raw: DbShape) => Shape[K];
  };
};

export interface ModelConfig<DbShape, Shape = DbShape> {
  name: string;
  primaryField: keyof Shape;
  fields: Thunk<FieldsConfig<DbShape, Shape>>;
}

export type GetArgs<Shape> = {
  [K in keyof Shape]?: Shape[K] | Shape[K][];
};

export type BuiltModel<DbShape, Shape = DbShape> = {
  name: string;
  fields: {
    [K in keyof Shape]: keyof DbShape;
  };
  get: (args: GetArgs<Shape>) => void;
};
