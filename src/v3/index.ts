interface DbUser {
  id: number;
  first_name: string;
  last_name: string;
  age: number;
  username: string;
}

interface User {
  id: number;
  name: string;
  age: number
  username: string;
}

type PromiseMaybe<T> = T | Promise<T>;

interface ModelArgs<DbShape, Shape> {
  name: string;
  primaryField: keyof DbShape,
  fields: () => {
    [K in keyof Shape]: {
      resolve: (raw: DbShape) => PromiseMaybe<Shape[K]>;
      type?: Model<any>;
    };
  };
}

class Model<DbShape, Shape = DbShape> {
  constructor(args: ModelArgs<DbShape, Shape>) {
    console.log(args);
  }
}

const User = new Model<DbUser, User>({
  name: 'User',
  primaryField: 'id',
  fields: () => ({
    id: {
      resolve: raw => raw.id,
    },
    name: {
      resolve: raw => `${raw.first_name} ${raw.last_name}`,
    },
    age: {
      resolve: raw => raw.age,
    },
    username: {
      resolve: raw => raw.username,
    },
  }),
});

const Tag = new Model<{ id: number, name: string, userId: number }>({
  name: 'Tag',
  primaryField: 'id',
  fields: () => ({
    id: {
      resolve: raw => raw.id,
    },
    name: {
      resolve: raw => raw.name,
    },
    userId: {
      resolve: raw => raw.userId,
      type: User,
    }
  }),
});
