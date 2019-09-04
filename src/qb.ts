class CancelablePromise<T> extends Promise<T>{
  public cancelMethod: () => void;
  constructor(executor: (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void) {
    super(executor);

  }

  //cancel the operation
  public cancel() {
    if (this.cancelMethod) {
      this.cancelMethod();
    }
  }
}
