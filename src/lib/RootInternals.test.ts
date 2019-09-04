import { RootInternals } from './RootInternals';
import { ModelArgs } from '.';

describe('RootInternals', () => {
  describe('addModel', () => {
    it('should throw an error for duplicate name', () => {
      const args1: ModelArgs<{}> = {
        name: 'Name',
        fields: () => ({}),
      };
      const args2: ModelArgs<{}> = {
        name: 'Name',
        fields: () => ({}),
      };

      const rootInternals = new RootInternals();
      rootInternals.addModel(args1);

      expect(() => rootInternals.addModel(args2)).toThrowError('Model with name Name already exists');
    });
  });
});
