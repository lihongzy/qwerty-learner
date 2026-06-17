export type StateUpdater<T> = T | ((previousValue: T) => T);

const hasWindow = typeof window !== 'undefined';

const isPlainRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const normalizeStoredValue = <T>(storedValue: unknown, defaultValue: T): T => {
  if (!isPlainRecord(defaultValue)) {
    return typeof storedValue === typeof defaultValue ? (storedValue as T) : defaultValue;
  }

  if (!isPlainRecord(storedValue)) {
    return defaultValue;
  }

  return {
    ...defaultValue,
    ...storedValue,
  };
};

export const readStoredValue = <T>(key: string, defaultValue: T): T => {
  if (!hasWindow) {
    return defaultValue;
  }

  const rawValue = window.localStorage.getItem(key);

  if (rawValue === null) {
    return defaultValue;
  }

  try {
    return normalizeStoredValue(JSON.parse(rawValue), defaultValue);
  } catch {
    return defaultValue;
  }
};

export const writeStoredValue = <T>(key: string, value: T) => {
  if (!hasWindow) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
};

export const resolveStateUpdater = <T>(previousValue: T, nextValue: StateUpdater<T>): T => {
  return typeof nextValue === 'function' ? (nextValue as (previousValue: T) => T)(previousValue) : nextValue;
};
