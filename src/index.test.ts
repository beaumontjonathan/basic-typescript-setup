import hello from '.';

describe('index', () => {
  it('should export hello world', () => {
    expect(hello).toBe('hello world');
  });
});
