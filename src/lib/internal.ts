export class Internals {
  private readonly models: Map<string, {}> = new Map();

  public hasModel(name: string): boolean {
    return this.models.has(name);
  }

  public addModel(name: string): void {
    this.models.set(name, {});
  }
}
