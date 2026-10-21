export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

const toCamelCase = (key: string): string =>
  key.replace(/_([a-z0-9])/g, (_, char: string) => char.toUpperCase());

export const snakeToCamel = (value: JsonValue): JsonValue => {
  if (Array.isArray(value)) {
    return value.map(snakeToCamel);
  }
  if (value !== null && typeof value === 'object') {
    const result: { [key: string]: JsonValue } = {};
    for (const [key, nested] of Object.entries(value)) {
      result[toCamelCase(key)] = snakeToCamel(nested);
    }
    return result;
  }
  return value;
};
