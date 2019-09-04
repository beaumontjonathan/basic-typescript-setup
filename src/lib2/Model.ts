import RootInternals from './RootInternals';
import { Table } from './types';

const rootInternals = new RootInternals();

export default class Model<DbShape, Shape = DbShape> {
  constructor(args: Table<DbShape, Shape>) {

  }
}


new Model<{ id: string }>({
  name: 'asdf',
  fields: () => ({
    id: {
      fieldName: 'id',
      resolve: d => d.id,
    },
  }),
});
