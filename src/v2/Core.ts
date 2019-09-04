import Knex, { QueryBuilder } from 'knex';
import { ModelConfig } from './types';
import { InternalModel } from './InternalModel';

export class Core {
  private modelConfigs: ModelConfig<any>[] = [];
  private readonly knex: Knex;

  private internalModels: Map<string, InternalModel<any>> = new Map();

  constructor(knex: Knex) {
    this.knex = knex;
    this.knex.on('query', console.log);
  };

  public addModel<DbShape, Shape = DbShape>(config: ModelConfig<DbShape, Shape>) {
    this.ensureUniqueModelName(config);
    this.modelConfigs.push(config);
  }

  private ensureUniqueModelName(args: ModelConfig<any>): void {
    if (this.modelConfigs.some(({ name }) => name === args.name)) {
      throw new Error(`Model with name ${args.name} already exists`);
    }
  }

  public hasModelWithName(modelName: string): boolean {
    return this.modelConfigs.some(({ name }) => name === modelName);
  }

  public init(): void {
    this.modelConfigs.forEach((modelConfig) => {
      this.internalModels.set(modelConfig.name, new InternalModel(modelConfig, this));
    });
  }

  public queryModel(modelName: string): QueryBuilder {
    if (!this.internalModels.has(modelName)) {
      throw new Error(`Cannot query model ${modelName} as it was not found`);
    }

    return this.knex(modelName);
  }

  public getKnex(): Knex {
    return this.knex;
  }

  public async destroy(): Promise<void> {
    await this.knex.destroy();
  }
}
