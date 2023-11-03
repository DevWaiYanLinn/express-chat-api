export const env = <T>(key: string, defaultValue: T): () => T => {
  return (): T => {
    if (process.env[key] !== undefined) {
      return process.env[key] as unknown as T;
    }
    return defaultValue;
  }
};