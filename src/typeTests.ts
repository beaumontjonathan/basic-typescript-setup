type Test<T extends (...args: A) => any, A extends any[]> = ReturnType<T>;
