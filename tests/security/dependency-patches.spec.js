'use strict';

const Path = require('path');
const deepmerge = require(require.resolve('deepmerge', {
  paths: [Path.dirname(require.resolve('jest-config'))],
}));
describe('deepmerge prototype poisoning protection', () => {
  const poison = () => JSON.parse('{"__proto__":{"injected":true},"safe":1}');

  test.each(['source', 'target'])('ignores an own __proto__ key in the %s', side => {
    const result = side === 'source'
      ? deepmerge(Object.create(null), poison())
      : deepmerge(poison(), { other: 2 });
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    expect(result.injected).toBeUndefined();
    expect(Object.hasOwn(result, '__proto__')).toBe(false);
    expect(result.safe).toBe(1);
    expect({}.injected).toBeUndefined();
  });

  test('does not poison cloned nested objects or array members', () => {
    const result = deepmerge({}, { nested: poison(), list: [poison()] });
    for (const value of [result.nested, result.list[0]]) {
      expect(Object.getPrototypeOf(value)).toBe(Object.prototype);
      expect(value.injected).toBeUndefined();
      expect(value.safe).toBe(1);
    }
  });

  test('preserves normal deep merges, arrays, and enumerable symbols', () => {
    const symbol = Symbol('metadata');
    const target = { nested: { first: 1 }, list: [1], [symbol]: { first: 1 } };
    const source = { nested: { second: 2 }, list: [2], [symbol]: { second: 2 } };
    const result = deepmerge(target, source);
    expect(result).toEqual({
      nested: { first: 1, second: 2 },
      list: [1, 2],
      [symbol]: { first: 1, second: 2 },
    });
    expect(target.nested).toEqual({ first: 1 });
    expect(source.nested).toEqual({ second: 2 });
  });
});
