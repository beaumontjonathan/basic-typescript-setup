export type Thunk<T> = () => T;

// @ts-ignore
export type CHANGE_ME_RETURN_TYPE<DbShape, Shape> = {
  name: string;
  fields: {
    [k in keyof Shape]: string;
  };
};

export type TableFields<DbShape, Shape = DbShape> = {
  [K in keyof Shape]: {
    fieldName: keyof DbShape;
    model?: CHANGE_ME_RETURN_TYPE<DbShape, Shape>;
    resolve: (raw: DbShape) => Shape[K];
  };
};

export interface Table<DbShape, Shape = DbShape> {
  name: string;
  fields: Thunk<TableFields<DbShape, Shape>>;
}
