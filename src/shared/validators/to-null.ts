const toNull = <T>(value: T | undefined): T | null => {
  return value === undefined ? null : value;
};
export { toNull };
