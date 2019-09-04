import RootInternals from './RootInternals';
import { Table } from './types';

describe('RootInternals', () => {
  describe('addModel', () => {
    it('should throw an error for duplicate name', () => {
      const table1: Table<{}> = {
        name: 'Name',
        fields: () => ({}),
      };
      const table2: Table<{}> = {
        name: 'Name',
        fields: () => ({}),
      };

      const rootInternals = new RootInternals();
      rootInternals.addModel(table1);

      expect(() => rootInternals.addModel(table2))
        .toThrowError('Model with name Name already exists');
    });
  });
});
