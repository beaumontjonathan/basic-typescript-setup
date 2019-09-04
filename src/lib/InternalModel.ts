import { ModelArgs, ReturnFields } from '.';
import { RootInternals } from './RootInternals';

export interface FieldPair {
  dbField: string;
  field: string;
}

export default class InternalModel<DbShape, Shape> {
  // @ts-ignore
  private readonly args: ModelArgs<DbShape, Shape>;
  // @ts-ignore
  private readonly internals: RootInternals;

  private fieldPairs: FieldPair[];
  private fields: ReturnFields<DbShape, Shape>;

  constructor(args: ModelArgs<DbShape, Shape>, internals: RootInternals) {
    this.args = args;
    this.internals = internals;
    this.fields = args.fields();
    this.fieldPairs = Object
      .entries(this.fields)
      // @ts-ignore
      .map(([field, { fieldName: dbField }]) => ({
        field,
        dbField,
      }));
    this.runFieldValidations();
  }

  private runFieldValidations(): void {
    const numberOfFields = this.fieldPairs.length;

    const fieldSet = new Set(this.fieldPairs.map(({ field }) => field));
    const dbFieldSet = new Set(this.fieldPairs.map(({ dbField }) => dbField));

    if (fieldSet.size !== numberOfFields) {
      throw new Error('Too few unique fields');
    }

    if (dbFieldSet.size !== numberOfFields) {
      throw new Error('Too few unique db fields');
    }
  }
}
