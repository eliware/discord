import { validateBooleanMap, isPlainObject } from '../src/validation.mjs';

describe('validation helpers', () => {
  it.each([null, [], 'value', 1, true])('rejects non-plain object: %p', (value) => {
    expect(isPlainObject(value)).toBe(false);
  });

  it('accepts plain objects and null-prototype objects', () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject(Object.create(null))).toBe(true);
  });

  it('validates boolean maps', () => {
    const keys = new Set(['enabled']);
    expect(() => validateBooleanMap({ enabled: true }, keys, 'options')).not.toThrow();
    expect(() => validateBooleanMap(undefined, keys, 'options')).not.toThrow();
    expect(() => validateBooleanMap({ other: true }, keys, 'options')).toThrow('Unknown options key: other');
    expect(() => validateBooleanMap({ enabled: 1 }, keys, 'options')).toThrow('options.enabled must be a boolean.');
    expect(() => validateBooleanMap([], keys, 'options')).not.toThrow();
    expect(() => validateBooleanMap('bad', keys, 'options')).toThrow('options must be an object of boolean values.');
  });
});

describe('context and locale validation', () => {
  it('rejects reserved context keys', async () => {
    const { validateContext } = await import('../src/validation.mjs');
    expect(() => validateContext({ client: 'bad' })).toThrow('context cannot define reserved key: client');
    expect(() => validateContext([])).toThrow('context must be a plain object.');
  });

  it('validates flat string locales', async () => {
    const { validateLocale } = await import('../src/validation.mjs');
    expect(validateLocale({ hello: 'Hello' })).toBe(true);
    expect(validateLocale(null)).toBe(false);
    expect(validateLocale({ nested: { value: 'no' } })).toBe(false);
    expect(validateLocale({ count: 1 })).toBe(false);
  });
});
