import { Internals } from './internal';

type Thunk<T> = () => T;
// type Thunk<T> = T | (() => T);

export type ReturnFields<DbFields, Fields> = {
  [K in keyof Fields]: {
    fieldName: keyof DbFields;
    model?: BuiltModel<any>;
    resolve: (raw: DbFields) => Fields[K];
  }
}

export interface ModelArgs<DbFields, Fields = DbFields> {
  name: string;
  linkedModels?: Array<BuiltModel<any>>;
  fields: Thunk<ReturnFields<DbFields, Fields>>;
}

// @ts-ignore
export type BuiltModel<DbField, Fields = DbField> = {
  name: string;
  fields: {
    [K in keyof Fields]: string
  };
}

// const getKeys = <T extends {}>(o: T) => Object.keys(o) as unknown as {[K in keyof T]: string};

const internals = new Internals();

const ensureModelsValid = ({ name, fields }: Pick<ModelArgs<any, any>, 'name' | 'linkedModels' | 'fields'>) => {
  if (internals.hasModel(name)) {
    throw new Error(`Model ${name} already exists`);
  }

  Object
    .values(fields())
    .map(({ model }) => model)
    .filter(model => model && !internals.hasModel(model.name))
    .forEach((model) => {
      throw new Error(`Model ${(model as BuiltModel<any>).name} does not exist`)
    });
};

export const Model = <DbFields, Fields = DbFields>(args: ModelArgs<DbFields, Fields>): BuiltModel<DbFields, Fields> => {
  const {
    name,
    fields,
  } = args;

  // const fieldNames = getKeys(fields());
  ensureModelsValid(args);
  const fieldNames = Object.keys(fields());
  internals.addModel(name);

  return {
    name,
    // @ts-ignore
    fields: fieldNames.reduce((obj, fieldName) => ({ ...obj, [fieldName]: fieldName }), {}),
  }
};
