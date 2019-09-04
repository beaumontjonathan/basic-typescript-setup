import InternalModel from './InternalModel';
import { ModelArgs } from './index';
import { RootInternals } from './RootInternals';

const rootInternals = new RootInternals();

describe('InternalModel', () => {
  it('should not throw if db names consistent', () => {
    const args: ModelArgs<{
      id: number;
      name: string;
    }> = {
      name: 'Tag',
      fields: () => ({
        id: {
          fieldName: 'id',
          resolve: tag => tag.id,
        },
        name: {
          fieldName: 'name',
          resolve: tag => tag.name,
        },
      }),
    };

    expect(() => new InternalModel(args, rootInternals)).not.toThrow();
  });

  it('should throw if db names inconsistent', () => {
    const args: ModelArgs<{
      id: number;
      name: string;
    }> = {
      name: 'Tag',
      fields: () => ({
        id: {
          fieldName: 'id',
          resolve: tag => tag.id,
        },
        name: {
          fieldName: 'id',
          resolve: tag => tag.name,
        },
      }),
    };

    expect(() => new InternalModel(args, rootInternals)).toThrow();
  });
});
