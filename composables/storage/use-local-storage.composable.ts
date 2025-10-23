import { Signal, computed, signal, effect, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type LocalStorageOptions = {
  defaultValue?: any;
  serialize?: (value: any) => string;
  deserialize?: (value: string) => any;
  key: string;
};

/*
 * Creates a two-way sync between a signal and localStorage. The signal will be initialized
 * with the value from localStorage (or the default value), and changes to the signal will
 * be persisted to localStorage.
 *
 * @param options - Configuration options for localStorage sync
 * @param options.key - The localStorage key to sync with
 * @param options.defaultValue - Default value if nothing is stored (optional)
 * @param options.serialize - Custom serialization function (defaults to JSON.stringify)
 * @param options.deserialize - Custom deserialization function (defaults to JSON.parse)
 *
 * Example:
 *
 * const userPreferences = useLocalStorage({
 *   key: 'user-preferences',
 *   defaultValue: { theme: 'light', language: 'en' }
 * });
 *
 * // Changes to userPreferences will automatically sync to localStorage
 * userPreferences.set({ theme: 'dark', language: 'en' });
 */
export function useLocalStorage<T>(options: LocalStorageOptions): Signal<T> {
  const document = inject(DOCUMENT);
  const storage = document.defaultView?.localStorage;
  
  if (!storage) {
    throw new Error('localStorage is not available');
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

  // Sync signal changes to localStorage
  effect(() => {
    const value = storageSignal();
    try {
      storage.setItem(key, serialize(value));
    } catch (error) {
      console.warn(`Failed to save to localStorage for key "${key}":`, error);
    }
  });

  return storageSignal.asReadonly();
}
