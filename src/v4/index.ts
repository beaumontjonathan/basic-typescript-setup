type MaybePromise<T> = T | Promise<T>;

interface ModelArgs<DbShape, Shape> {
  name: string;
  fields: {
    [Field in keyof Shape]: {
      resolve: (raw: DbShape) => MaybePromise<Shape[Field]>;
      references?: ModelValue<null, null>;
    };
  };
}

interface ModelValue<DbShape, Shape> {

}

const makeModel = <DbShape, Shape = DbShape>(args: ModelArgs<DbShape, Shape>): ModelValue<DbShape, Shape> => {
  console.log(args);
  return {};
};

const U = makeModel<{}>({ name: 'U', fields: {} });
const V = makeModel<{name: string}>({ name: 'V', fields: { name: { resolve: () => '' } } })
