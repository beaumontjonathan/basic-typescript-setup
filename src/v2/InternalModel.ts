import { zipWith } from 'lodash';
import { Core } from './Core';
import { FieldsConfig, ModelConfig } from './types';

interface FieldPair<DbShape, Shape> {
  dbField: keyof DbShape;
  field: keyof Shape;
}

export const getFieldPairsFromFieldsConfig = <DbShape, Shape>(fieldsConfig: FieldsConfig<DbShape, Shape>): FieldPair<DbShape, Shape>[] => {
  const fieldNames = Object
    .keys(fieldsConfig) as (keyof Shape)[];

  const dbFieldNames = Object
    .values(fieldsConfig as unknown as { fieldName: keyof DbShape }[])
    .map(({ fieldName }) => fieldName);

  return zipWith<
    keyof DbShape,
    keyof Shape,
    FieldPair<DbShape, Shape>
  >(dbFieldNames, fieldNames, (dbField, field) => ({ dbField, field }));
};

export class InternalModel<DbShape, Shape = DbShape> {
  private readonly core: Core;
  private readonly config: ModelConfig<DbShape, Shape>;
  private readonly fieldsConfig: FieldsConfig<DbShape, Shape>;

  private readonly fieldPairs: FieldPair<DbShape, Shape>[];

  constructor(config: ModelConfig<DbShape, Shape>, core: Core) {
    this.config = config;
    this.core = core;
    this.fieldsConfig = config.fields();

    this.fieldPairs = getFieldPairsFromFieldsConfig(this.fieldsConfig);

    this.runFieldValidations();
  }

  private runFieldValidations(): void {
    this.ensureFieldLengths();
    this.ensureFieldModelsExist();
  }

  private ensureFieldLengths(): void {
    const numberOfFields = this.fieldPairs.length;

    const fieldSet = new Set(this.fieldPairs.map(({ field }) => field));
    const dbFieldSet = new Set(this.fieldPairs.map(({ dbField }) => dbField));

    if (fieldSet.size !== numberOfFields) {
      throw new Error('Too few unique fields');
    }

    if (dbFieldSet.size !== numberOfFields) {
      // throw new Error('Too few unique db fields');
    }
  }

  private ensureFieldModelsExist(): void {
    (Object.keys(this.fieldsConfig) as (keyof Shape)[])
      .map(fn => this.fieldsConfig[fn].model)
      .filter(model => model && !this.core.hasModelWithName(model.name))
      .forEach((model) => {
        throw new Error(`Model with name ${model && model.name} does not exist`);
      });
  }

  public get name(): string {
    return this.config.name;
  }
}
