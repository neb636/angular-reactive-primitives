import { Signal, computed, signal, effect, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type SessionStorageOptions = {
  defaultValue?: any;
  serialize?: (value: any) => string;
  deserialize?: (value: string) => any;
  key: string;
};

/*
 * Creates a two-way sync between a signal and sessionStorage. The signal will be initialized
 * with the value from sessionStorage (or the default value), and changes to the signal will
 * be persisted to sessionStorage.
 *
 * @param options - Configuration options for sessionStorage sync
 * @param options.key - The sessionStorage key to sync with
 * @param options.defaultValue - Default value if nothing is stored (optional)
 * @param options.serialize - Custom serialization function (defaults to JSON.stringify)
 * @param options.deserialize - Custom deserialization function (defaults to JSON.parse)
 *
 * Example:
 *
 * const temporaryData = useSessionStorage({
 *   key: 'temp-form-data',
 *   defaultValue: { name: '', email: '' }
 * });
 *
 * // Changes to temporaryData will automatically sync to sessionStorage
 * temporaryData.set({ name: 'John', email: 'john@example.com' });
 */
export function useSessionStorage<T>(options: SessionStorageOptions): Signal<T> {
  const document = inject(DOCUMENT);
  const storage = document.defaultView?.sessionStorage;
  
  if (!storage) {
    throw new Error('sessionStorage is not available');
  }

  const { key, defaultValue, serialize = JSON.stringify, deserialize = JSON.parse } = options;

  // Initialize signal with stored value or default
  const getStoredValue = (): T => {
    try {
      const stored = storage.getItem(key);
      return stored ? deserialize(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const storageSignal = signal<T>(getStoredValue());

  // Sync signal changes to sessionStorage
  effect(() => {
    const value = storageSignal();
    try {
      storage.setItem(key, serialize(value));
    } catch (error) {
      console.warn(`Failed to save to sessionStorage for key "${key}":`, error);
    }
  });

  return storageSignal.asReadonly();
}
