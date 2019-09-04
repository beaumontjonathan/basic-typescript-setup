import { GetArgs, ModelConfig } from './types';
import { Core } from './Core';
import { QueryBuilder } from 'knex';
import { tableField } from './helpers';

export type BuildModelFields<DbShape, Shape> = {
  [K in keyof Shape]: keyof DbShape;
};

export class BuiltModel<DbShape, Shape = DbShape> {
  private readonly config: ModelConfig<DbShape, Shape>;
  private readonly core: Core;

  constructor(config: ModelConfig<DbShape, Shape>, core: Core) {
    this.config = config;
    this.core = core;
    this.core.addModel(this.config);
  }

  public resolver(raw: DbShape): Shape {
    const fields = this.config.fields();

    // @ts-ignore
    return Object
      .entries(fields)
      // @ts-ignore
      .map(([field, { resolve, fieldName }]) => ({ [field]: resolve ? resolve(raw) : raw[fieldName] }))
      .reduce((a, b) => ({ ...a, ...b }), {});
  }

  public get name(): string {
    return this.config.name;
  }

  public get primaryField(): string {
    return `${this.config.primaryField}`;
  }

  public get formattedPrimaryField(): string {
    return this.formatField(this.primaryField);
  }

  public fieldNameHasModel(fieldName: keyof DbShape, model: BuiltModel<any>): boolean {
    const fields = this.config.fields();

    const entry = Object
      .values(fields)
      // @ts-ignore
      .find(({ fieldName: fn }) => fn === fieldName);

    if (!entry) {
      throw new Error(`Db field ${fieldName} does not exist on model ${this.name}`);
    }

    // @ts-ignore
    return entry.model === model;
  }

  public getFieldNameWithModel(builtModel: BuiltModel<any>): keyof DbShape {
    const fields = this.config.fields();

    const [fieldName, fn2] = Object.values(fields)
      // @ts-ignore
      .filter(({ model }) => model === builtModel)
      // @ts-ignore
      .map(({ fieldName }) => fieldName);

    if (fn2) {
      throw new Error(`Cannot have multiple fields with the same model`);
    }

    if (!fieldName) {
      throw new Error(`Model ${builtModel.name} not found on any fields for ${this.name}`);
    }

    return fieldName;
  }

  public get fields(): BuildModelFields<DbShape, Shape> {
    return Object
      .entries(this.config.fields())
      // @ts-ignore
      .reduce((obj, [field, { fieldName }]) => ({
        ...obj,
        [field]: fieldName,
      }), {}) as BuildModelFields<DbShape, Shape>;
  }

  public get(args: GetArgs<Shape>): QueryBuilder {
    const whereClauses = Object.entries(args);
    const wheres = whereClauses.filter(([_, values]) => !Array.isArray(values));
    const whereIns = whereClauses.filter(([_, values]) => Array.isArray(values));
    const query = this.core.queryModel(this.config.name).select(this.formatField('*'));
    wheres.forEach(([field, value]) => query.where(this.formatField(field), value));
    whereIns.forEach(([field, values]) => query.whereIn(this.formatField(field), values));
    return query;
  }

  public getWithLinked<LinkedDbShape, LinkedShape>(args: GetArgs<Shape>, model: BuiltModel<LinkedDbShape, LinkedShape>, linkedArgs: GetArgs<LinkedShape>): QueryBuilder {
    const whereClauses = Object.entries(linkedArgs);
    const wheres = whereClauses.filter(([_, values]) => !Array.isArray(values));
    const whereIns = whereClauses.filter(([_, values]) => Array.isArray(values));

    const query = this
      .get(args)
      .join(model.name, this.formatField(this.getFieldNameWithModel(model)), model.formattedPrimaryField);

    wheres.forEach(([field, value]) => query.where(model.formatField(field), value));
    whereIns.forEach(([field, values]) => query.whereIn(model.formatField(field), values));

    return query;
  }

  public query(): MyQueryBuilder<DbShape, Shape> {
    return new MyQueryBuilder(this, this.core.queryModel(this.config.name));
  }

  public formatField(fieldName: string | keyof DbShape): string {
    return tableField(this.name, fieldName as string);
  }
}

export const Model = <DbShape, Shape = DbShape>(config: ModelConfig<DbShape, Shape>, core: Core): BuiltModel<DbShape, Shape> => (
  new BuiltModel<DbShape, Shape>(config, core)
);

export class MyQueryBuilder<BaseDbShape, BaseShape> {
  private readonly usedModels: BuiltModel<any>[] = [];
  private readonly model: BuiltModel<BaseDbShape, BaseShape>;
  private readonly queryBuilder: QueryBuilder;

  constructor(model: BuiltModel<BaseDbShape, BaseShape>, queryBuilder: QueryBuilder) {
    this.model = model;
    this.queryBuilder = queryBuilder.select(this.model.formatField('*'));
    this.usedModels.push(this.model);
  }

  private numberOfTimesModelUsed(model: BuiltModel<any>): number {
    return this.usedModels.filter(m => m === model).length;
  }

  public get(args: GetArgs<BaseShape> = {}): this {
    const whereClauses = Object.entries(args);
    const wheres = whereClauses.filter(([_, values]) => !Array.isArray(values));
    const whereIns = whereClauses.filter(([_, values]) => Array.isArray(values));
    wheres.forEach(([field, value]) => this.queryBuilder.where(this.model.formatField(field), value));
    whereIns.forEach(([field, values]) => this.queryBuilder.whereIn(this.model.formatField(field), values));
    return this;
  }

  public onFieldWithModel<DbShape, Shape>(field: keyof BaseDbShape, model: BuiltModel<DbShape, Shape>, args: GetArgs<Shape>): this {
    if (!this.model.fieldNameHasModel(field, model)) {
      throw new Error(`Db field ${field} does not have model ${model.name} on model ${this.model.name}`);
    }

    return this.internalWithModel(field, model, args);
  }

  public withModel<DbShape, Shape>(model: BuiltModel<DbShape, Shape>, args: GetArgs<Shape>): this {
    const field = this.model.getFieldNameWithModel(model);

    return this.internalWithModel(field, model, args);
  }

  private internalWithModel<DbShape, Shape>(field: keyof BaseDbShape, model: BuiltModel<DbShape, Shape>, args: GetArgs<Shape>): this {
    const whereClauses = Object.entries(args);
    const wheres = whereClauses.filter(([_, values]) => !Array.isArray(values));
    const whereIns = whereClauses.filter(([_, values]) => Array.isArray(values));

    const numberOfTimesModelUsed = this.numberOfTimesModelUsed(model);
    const alias = numberOfTimesModelUsed === 0 ? model.name : `${model.name}${numberOfTimesModelUsed}`;
    this.usedModels.push(model);
    this.queryBuilder.join(
      `${model.name} as ${alias}`,
      this.model.formatField(field),
      // model.formattedPrimaryField,
      tableField(alias, model.primaryField),
    );

    wheres.forEach(([field, value]) => this.queryBuilder.where(tableField(alias, field), value));
    whereIns.forEach(([field, values]) => this.queryBuilder.whereIn(tableField(alias, field), values));

    return this;
  }

  public async done(): Promise<BaseShape | BaseShape[]> {
    try {
      const results = await this.queryBuilder;

      if (Array.isArray(results)) {
        return results.map(r => this.model.resolver(r));
      }

      return this.model.resolver(results);
    } catch (error) {
      console.log('Oh no, an error', error.message);

      throw error;
    }
  }
}
