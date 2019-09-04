import { Core } from './Core';
import { ModelConfig } from './types';


describe('Core', () => {
  it('should throw if name duplicate', () => {
    const config1: ModelConfig<{}> = {
      name: 'Name',
      fields: () => ({}),
    };
    const config2: ModelConfig<{}> = {
      name: 'Name',
      fields: () => ({}),
    };
    const core = new Core();
    core.addModel(config1);
    expect(() => core.addModel(config2))
      .toThrowError('Model with name Name already exists');
  });
});
