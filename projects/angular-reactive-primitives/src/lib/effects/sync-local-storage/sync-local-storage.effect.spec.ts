import { TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { vi, expect } from 'vitest';
import { syncLocalStorageEffect } from './sync-local-storage.effect';

describe('syncLocalStorageEffect', () => {
  let mockLocalStorage: Storage;

  beforeEach(() => {
    // Create mock localStorage
    const storage: Record<string, string> = {};
    mockLocalStorage = {
      getItem: (key: string) => storage[key] || null,
      setItem: (key: string, value: string) => {
        storage[key] = value;
      },
      removeItem: (key: string) => {
        delete storage[key];
      },
      clear: () => {
        Object.keys(storage).forEach((key) => delete storage[key]);
      },
      key: (index: number) => Object.keys(storage)[index] || null,
      length: Object.keys(storage).length,
    };

    // Spy on console.warn to check warnings
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: DOCUMENT,
          useFactory: () => {
            const doc = document.implementation.createHTMLDocument();
            Object.defineProperty(doc, 'defaultView', {
              value: {
                localStorage: mockLocalStorage,
              },
              writable: true,
            });
            return doc;
          },
        },
      ],
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should sync signal value to localStorage on initial render', () => {
    @Component({
      template: '',
    })
    class TestComponent {
      mySignal = signal({ name: 'John', age: 30 });

      constructor() {
        syncLocalStorageEffect({
          signal: this.mySignal,
          key: 'test-key',
        });
      }
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    // Should save initial value to localStorage
    const stored = mockLocalStorage.getItem('test-key');
    expect(stored).toBe(JSON.stringify({ name: 'John', age: 30 }));
  });

  it('should sync signal changes to localStorage', () => {
    @Component({
      template: '',
    })
    class TestComponent {
      mySignal = signal('initial value');

      constructor() {
        syncLocalStorageEffect({
          signal: this.mySignal,
          key: 'test-key',
        });
      }
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;

    // Update signal
    component.mySignal.set('updated value');
    fixture.detectChanges();

    // Should update localStorage
    const stored = mockLocalStorage.getItem('test-key');
    expect(stored).toBe(JSON.stringify('updated value'));
  });

  it('should handle multiple updates to the same signal', () => {
    @Component({
      template: '',
    })
    class TestComponent {
      counter = signal(0);

      constructor() {
        syncLocalStorageEffect({
          signal: this.counter,
          key: 'counter',
        });
      }
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;

    // Multiple updates
    component.counter.set(1);
    fixture.detectChanges();
    expect(mockLocalStorage.getItem('counter')).toBe('1');

    component.counter.set(2);
    fixture.detectChanges();
    expect(mockLocalStorage.getItem('counter')).toBe('2');

    component.counter.set(3);
    fixture.detectChanges();
    expect(mockLocalStorage.getItem('counter')).toBe('3');
  });

  it('should use JSON.stringify by default for serialization', () => {
    @Component({
      template: '',
    })
    class TestComponent {
      data = signal({ items: [1, 2, 3], active: true });

      constructor() {
        syncLocalStorageEffect({
          signal: this.data,
          key: 'data',
        });
      }
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const stored = mockLocalStorage.getItem('data');
    expect(stored).toBe(JSON.stringify({ items: [1, 2, 3], active: true }));
  });

  it('should support custom serialization function', () => {
    @Component({
      template: '',
    })
    class TestComponent {
      data = signal({ name: 'Test' });

      constructor() {
        syncLocalStorageEffect({
          signal: this.data,
          key: 'custom-data',
          serialize: (value) => `CUSTOM:${JSON.stringify(value)}`,
        });
      }
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const stored = mockLocalStorage.getItem('custom-data');
    expect(stored).toBe('CUSTOM:{"name":"Test"}');
  });

  it('should handle string values', () => {
    @Component({
      template: '',
    })
    class TestComponent {
      text = signal('hello world');

      constructor() {
        syncLocalStorageEffect({
          signal: this.text,
          key: 'text',
        });
      }
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    expect(mockLocalStorage.getItem('text')).toBe('"hello world"');
  });

  it('should handle number values', () => {
    @Component({
      template: '',
    })
    class TestComponent {
      count = signal(42);

      constructor() {
        syncLocalStorageEffect({
          signal: this.count,
          key: 'count',
        });
      }
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    expect(mockLocalStorage.getItem('count')).toBe('42');
  });

  it('should handle boolean values', () => {
    @Component({
      template: '',
    })
    class TestComponent {
      isActive = signal(true);

      constructor() {
        syncLocalStorageEffect({
          signal: this.isActive,
          key: 'isActive',
        });
      }
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    expect(mockLocalStorage.getItem('isActive')).toBe('true');
  });

  it('should handle null values', () => {
    @Component({
      template: '',
    })
    class TestComponent {
      value = signal<string | null>(null);

      constructor() {
        syncLocalStorageEffect({
          signal: this.value,
          key: 'nullable',
        });
      }
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    expect(mockLocalStorage.getItem('nullable')).toBe('null');
  });

  it('should handle undefined values', () => {
    @Component({
      template: '',
    })
    class TestComponent {
      value = signal<string | undefined>(undefined);

      constructor() {
        syncLocalStorageEffect({
          signal: this.value,
          key: 'undefinable',
        });
      }
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    // JSON.stringify(undefined) returns undefined (not a string)
    // When setItem is called with undefined, it converts to string "undefined"
    const stored = mockLocalStorage.getItem('undefinable');
    // Our mock stores it, but in reality localStorage would convert to string
    expect(stored).toBeNull();
  });

  it('should handle array values', () => {
    @Component({
      template: '',
    })
    class TestComponent {
      items = signal([1, 2, 3, 4, 5]);

      constructor() {
        syncLocalStorageEffect({
          signal: this.items,
          key: 'items',
        });
      }
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    expect(mockLocalStorage.getItem('items')).toBe('[1,2,3,4,5]');
  });

  it('should handle complex nested objects', () => {
    @Component({
      template: '',
    })
    class TestComponent {
      data = signal({
        user: {
          name: 'John',
          address: {
            street: '123 Main St',
            city: 'Springfield',
          },
        },
        items: [1, 2, 3],
      });

      constructor() {
        syncLocalStorageEffect({
          signal: this.data,
          key: 'complex',
        });
      }
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const stored = mockLocalStorage.getItem('complex');
    const parsed = JSON.parse(stored!);
    expect(parsed.user.name).toBe('John');
    expect(parsed.user.address.city).toBe('Springfield');
    expect(parsed.items).toEqual([1, 2, 3]);
  });

  it('should handle empty string values', () => {
    @Component({
      template: '',
    })
    class TestComponent {
      text = signal('');

      constructor() {
        syncLocalStorageEffect({
          signal: this.text,
          key: 'empty',
        });
      }
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    expect(mockLocalStorage.getItem('empty')).toBe('""');
  });

  it('should handle empty object values', () => {
    @Component({
      template: '',
    })
    class TestComponent {
      data = signal({});

      constructor() {
        syncLocalStorageEffect({
          signal: this.data,
          key: 'empty-obj',
        });
      }
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    expect(mockLocalStorage.getItem('empty-obj')).toBe('{}');
  });

  it('should handle empty array values', () => {
    @Component({
      template: '',
    })
    class TestComponent {
      items = signal([]);

      constructor() {
        syncLocalStorageEffect({
          signal: this.items,
          key: 'empty-array',
        });
      }
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    expect(mockLocalStorage.getItem('empty-array')).toBe('[]');
  });

  it('should use different keys for different signals', () => {
    @Component({
      template: '',
    })
    class TestComponent {
      signal1 = signal('value1');
      signal2 = signal('value2');

      constructor() {
        syncLocalStorageEffect({
          signal: this.signal1,
          key: 'key1',
        });
        syncLocalStorageEffect({
          signal: this.signal2,
          key: 'key2',
        });
      }
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    expect(mockLocalStorage.getItem('key1')).toBe('"value1"');
    expect(mockLocalStorage.getItem('key2')).toBe('"value2"');
  });

  it('should handle storage errors gracefully', () => {
    // Create a mock that throws on setItem
    const errorStorage = {
      ...mockLocalStorage,
      setItem: vi.fn(() => {
        throw new Error('Quota exceeded');
      }),
    };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: DOCUMENT,
          useFactory: () => {
            const doc = document.implementation.createHTMLDocument();
            Object.defineProperty(doc, 'defaultView', {
              value: {
                localStorage: errorStorage,
              },
              writable: true,
            });
            return doc;
          },
        },
      ],
    });

    @Component({
      template: '',
    })
    class TestComponent {
      data = signal('test');

      constructor() {
        syncLocalStorageEffect({
          signal: this.data,
          key: 'test-key',
        });
      }
    }

    const fixture = TestBed.createComponent(TestComponent);
    
    // Should not throw, should log warning instead
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('Failed to save to localStorage for key "test-key"'),
      expect.any(Error)
    );
  });

  it('should warn when localStorage is not available', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: DOCUMENT,
          useFactory: () => {
            const doc = document.implementation.createHTMLDocument();
            Object.defineProperty(doc, 'defaultView', {
              value: null, // No window/localStorage
              writable: true,
            });
            return doc;
          },
        },
      ],
    });

    @Component({
      template: '',
    })
    class TestComponent {
      data = signal('test');

      constructor() {
        syncLocalStorageEffect({
          signal: this.data,
          key: 'test-key',
        });
      }
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    expect(console.warn).toHaveBeenCalledWith('localStorage is not available');
  });

  it('should not throw when localStorage is not available', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: DOCUMENT,
          useFactory: () => {
            const doc = document.implementation.createHTMLDocument();
            Object.defineProperty(doc, 'defaultView', {
              value: null,
              writable: true,
            });
            return doc;
          },
        },
      ],
    });

    @Component({
      template: '',
    })
    class TestComponent {
      data = signal('test');

      constructor() {
        syncLocalStorageEffect({
          signal: this.data,
          key: 'test-key',
        });
      }
    }

    expect(() => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
    }).not.toThrow();
  });

  it('should continue syncing after storage errors', () => {
    let shouldThrow = true;
    const errorStorage = {
      ...mockLocalStorage,
      setItem: vi.fn((key: string, value: string) => {
        if (shouldThrow) {
          throw new Error('Quota exceeded');
        }
        mockLocalStorage.setItem(key, value);
      }),
    };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: DOCUMENT,
          useFactory: () => {
            const doc = document.implementation.createHTMLDocument();
            Object.defineProperty(doc, 'defaultView', {
              value: {
                localStorage: errorStorage,
              },
              writable: true,
            });
            return doc;
          },
        },
      ],
    });

    @Component({
      template: '',
    })
    class TestComponent {
      data = signal('initial');

      constructor() {
        syncLocalStorageEffect({
          signal: this.data,
          key: 'test-key',
        });
      }
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    // First update should fail
    expect(console.warn).toHaveBeenCalled();

    // Stop throwing errors
    shouldThrow = false;
    
    // Reset console.warn spy to track only new calls
    vi.mocked(console.warn).mockClear();

    // Second update should succeed
    fixture.componentInstance.data.set('updated');
    fixture.detectChanges();

    expect(console.warn).not.toHaveBeenCalled();
    expect(mockLocalStorage.getItem('test-key')).toBe('"updated"');
  });

  it('should clean up on component destroy', () => {
    @Component({
      template: '',
    })
    class TestComponent {
      data = signal('test');

      constructor() {
        syncLocalStorageEffect({
          signal: this.data,
          key: 'test-key',
        });
      }
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    // Should clean up without errors
    expect(() => fixture.destroy()).not.toThrow();
  });

  it('should handle rapid signal updates', () => {
    @Component({
      template: '',
    })
    class TestComponent {
      counter = signal(0);

      constructor() {
        syncLocalStorageEffect({
          signal: this.counter,
          key: 'rapid-counter',
        });
      }
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;

    // Rapid updates
    for (let i = 1; i <= 100; i++) {
      component.counter.set(i);
      fixture.detectChanges();
    }

    // Should have last value
    expect(mockLocalStorage.getItem('rapid-counter')).toBe('100');
  });

  it('should work with multiple components using same key', () => {
    @Component({
      selector: 'test-component-1',
      template: '',
    })
    class TestComponent1 {
      data = signal('component1');

      constructor() {
        syncLocalStorageEffect({
          signal: this.data,
          key: 'shared-key',
        });
      }
    }

    @Component({
      selector: 'test-component-2',
      template: '',
    })
    class TestComponent2 {
      data = signal('component2');

      constructor() {
        syncLocalStorageEffect({
          signal: this.data,
          key: 'shared-key',
        });
      }
    }

    const fixture1 = TestBed.createComponent(TestComponent1);
    fixture1.detectChanges();

    // First component sets value
    expect(mockLocalStorage.getItem('shared-key')).toBe('"component1"');

    const fixture2 = TestBed.createComponent(TestComponent2);
    fixture2.detectChanges();

    // Second component overwrites value
    expect(mockLocalStorage.getItem('shared-key')).toBe('"component2"');
  });

  it('should demonstrate form draft use case', () => {
    @Component({
      template: '',
    })
    class FormComponent {
      formData = signal({ name: '', email: '', message: '' });

      constructor() {
        syncLocalStorageEffect({
          signal: this.formData,
          key: 'form-draft',
        });
      }
    }

    const fixture = TestBed.createComponent(FormComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;

    // Simulate user filling form
    component.formData.set({ name: 'John', email: '', message: '' });
    fixture.detectChanges();

    component.formData.set({ name: 'John', email: 'john@example.com', message: '' });
    fixture.detectChanges();

    component.formData.set({
      name: 'John',
      email: 'john@example.com',
      message: 'Hello world',
    });
    fixture.detectChanges();

    // Final form state should be saved
    const stored = JSON.parse(mockLocalStorage.getItem('form-draft')!);
    expect(stored).toEqual({
      name: 'John',
      email: 'john@example.com',
      message: 'Hello world',
    });
  });

  it('should demonstrate settings persistence use case', () => {
    @Component({
      template: '',
    })
    class SettingsComponent {
      settings = signal({
        theme: 'dark',
        notifications: true,
        language: 'en',
      });

      constructor() {
        syncLocalStorageEffect({
          signal: this.settings,
          key: 'user-settings',
        });
      }
    }

    const fixture = TestBed.createComponent(SettingsComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;

    // User changes settings
    component.settings.set({
      theme: 'light',
      notifications: false,
      language: 'es',
    });
    fixture.detectChanges();

    const stored = JSON.parse(mockLocalStorage.getItem('user-settings')!);
    expect(stored).toEqual({
      theme: 'light',
      notifications: false,
      language: 'es',
    });
  });

  it('should handle custom serialization for complex types', () => {
    class User {
      constructor(
        public name: string,
        public age: number
      ) {}

      toJSON() {
        return { name: this.name, age: this.age, type: 'User' };
      }
    }

    @Component({
      template: '',
    })
    class TestComponent {
      user = signal(new User('John', 30));

      constructor() {
        syncLocalStorageEffect({
          signal: this.user,
          key: 'user',
          serialize: (user: User) => JSON.stringify(user.toJSON()),
        });
      }
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const stored = JSON.parse(mockLocalStorage.getItem('user')!);
    expect(stored).toEqual({ name: 'John', age: 30, type: 'User' });
  });
});

