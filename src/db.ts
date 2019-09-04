import Knex, { QueryBuilder } from 'knex';

const knex = Knex({});

type ArrayOrSingle<T> = T | T[];

type Fields<RawType, OutputType> = {
  [K in keyof OutputType]: {
    type?: ModelReturn<any>;
    resolve: (raw: RawType) => OutputType[K];
  };
}

type Thunk<T> = (() => T) | T;

type ReturnFields<T> = {
  [K in keyof T]: string;
}

interface ModelArgs<RawType, OutputType> {
  name: string;
  primaryField: keyof OutputType;
  fields: Thunk<Fields<RawType, OutputType>>;
}

type ModelReturn<OutputType> = {
  get: (obj: Partial<OutputType>) => QueryBuilder;
  add: (obj: ArrayOrSingle<OutputType>) => QueryBuilder;
  fields: ReturnFields<OutputType>;
}

const Model = <RawType, OutputType = RawType>(args: ModelArgs<RawType, OutputType>): ModelReturn<OutputType> => {
  const fields = Object.keys(args.fields).reduce((obj, key) => ({ ...obj, [key]: key }), {});
  return {
    get: (obj?: Partial<OutputType>): QueryBuilder => {
      console.log(obj);
      return knex(args.name).select(Object.keys(args.fields));
    },
    add: (obj: ArrayOrSingle<OutputType>): QueryBuilder => {
      console.log(obj);
      return knex(args.name).insert(Object.keys(args.fields));
    },
    fields: (fields as ReturnFields<OutputType>),
  };
};

interface UserType {
  id: number;
  name: string;
}

const UserModel = Model<UserType>({
  name: 'User',
  primaryField: 'id',
  fields: {
    id: {
      resolve: raw => raw.id,
    },
    name: {
      resolve: raw => raw.name,
    },
  },
});

interface TagType {
  id: number;
  userId: number;
  name: string;
}

const TagModel = Model<TagType>({
  name: 'Tag',
  primaryField: 'id',
  fields: () => ({
    id: {
      resolve: raw => raw.id,
    },
    userId: {
      type: UserModel,
      resolve: raw => raw.userId,
    },
    name: {
      resolve: raw => raw.name,

    },
  }),
});

interface DbTask {
  task_id: number;
  task_name: string;
}

interface Task {
  id: number;
  name: string;
}

const TaskModel = Model<DbTask, TagType>({
  name: 'Task',
  primaryField: 'id',
})




(async () => {
  const results = await UserModel.get({
    id: 1,
  });
  UserModel.get({ id: 1 }).withForeign
})();
