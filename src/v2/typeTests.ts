type DbDataTypes = string | number | boolean | null | undefined;

// type TableShape = Record<string, DbDataTypes>;

export interface TableStructure {
  [s: string]: DbDataTypes;
}

export type TableShape<Shape> = Shape extends Record<string, DbDataTypes> ? never : {
  [K in keyof Shape]: DbDataTypes;
}

interface Field<DbShape extends TableStructure, FieldType> {
  fieldName: keyof DbShape;
  resolve: (raw: DbShape) => FieldType;
}

type FieldsConfig<Shape extends TableStructure, DbShape extends TableStructure> = {
  [K in keyof Shape]: Field<DbShape, Shape[K]>;
};

interface DbUser {
  id: number;
  user_name: string;
  password: string;
  age: number;
}

interface User {
  id: number;
  username: string;
  password: string;
  age: string;
}

const fields: FieldsConfig<TableShape<User>, DbUser extends never ? never : TableShape<DbUser>> = {
  id: {
    fieldName: 'id',
    resolve: raw => raw.id,
  },
  username: {
    fieldName: 'user_name',
    resolve: raw => raw.user_name,
  },
  password: {
    fieldName: 'password',
    resolve: raw => raw.password,
  },
  age: {
    fieldName: 'age',
    resolve: raw => `${raw.age}`,
  },
};

const userFields = Object.keys(fields);

const [field] = userFields;

fields[field]


