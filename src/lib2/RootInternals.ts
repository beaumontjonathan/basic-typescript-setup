import { Table } from './types';

export default class RootInternals {
  private tableList: Table<any>[] = [];

  public addModel<DbShape, Shape>(args: Table<DbShape, Shape>): void {
    this.ensureUniqueModelName(args);
    this.tableList.push(args);
  }

  private ensureUniqueModelName(args: Table<any>): void {
    if (this.tableList.some(({ name }) => name === args.name)) {
      throw new Error(`Model with name ${args.name} already exists`);
    }
  }
}
