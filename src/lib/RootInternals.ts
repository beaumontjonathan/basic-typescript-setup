import { ModelArgs } from '.';

export class RootInternals {
  private argsList:  ModelArgs<any>[] = [];

  public addModel<DbShape, Shape>(args: ModelArgs<DbShape, Shape>): void {
    this.ensureUniqueModelName(args);
    this.argsList.push(args);
  }

  private ensureUniqueModelName(args: ModelArgs<any>): void {
    if (this.argsList.some(({ name }) => name === args.name)) {
      throw new Error(`Model with name ${args.name} already exists`);
    }
  }
}
