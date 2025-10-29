# syncLocalStorageEffect

Effect that syncs a signal to localStorage (one-way: signal → storage). This is useful when you want to persist signal changes but don't need two-way sync.

## Usage

### Persist User Preferences

```ts
import { Component, signal } from '@angular/core';
import { syncLocalStorageEffect } from 'angular-reactive-primitives';

@Component({
  selector: 'user-settings',
  template: `
    <div class="settings">
      <label>
        Theme:
        <select [(ngModel)]="theme">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="auto">Auto</option>
        </select>
      </label>

      <label>
        Language:
        <select [(ngModel)]="language">
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
        </select>
      </label>

      <label>
        <input type="checkbox" [(ngModel)]="notifications" />
        Enable Notifications
      </label>
    </div>
  `,
})
export class UserSettingsComponent {
  theme = signal('light');
  language = signal('en');
  notifications = signal(true);

  constructor() {
    // Sync each preference to localStorage
    syncLocalStorageEffect({
      signal: this.theme,
      key: 'user-theme',
    });

    syncLocalStorageEffect({
      signal: this.language,
      key: 'user-language',
    });

    syncLocalStorageEffect({
      signal: this.notifications,
      key: 'user-notifications',
    });
  }
}
```

### Auto-Save Form Data

```ts
import { Component, signal } from '@angular/core';
import { syncLocalStorageEffect } from 'angular-reactive-primitives';

interface FormData {
  title: string;
  content: string;
  tags: string[];
}

@Component({
  selector: 'auto-save-form',
  template: `
    <form>
      <input [(ngModel)]="formTitle" placeholder="Title" />
      <textarea [(ngModel)]="formContent" placeholder="Content"></textarea>
      <div class="save-status">
        {{ saveStatus }}
      </div>
    </form>
  `,
})
export class AutoSaveFormComponent {
  formTitle = signal('');
  formContent = signal('');
  formTags = signal<string[]>([]);
  saveStatus = 'All changes saved to local storage';

  formData = computed<FormData>(() => ({
    title: this.formTitle(),
    content: this.formContent(),
    tags: this.formTags(),
  }));

  constructor() {
    // Auto-save form data
    syncLocalStorageEffect({
      signal: this.formData,
      key: 'draft-post',
    });
  }

  // On component init, load from localStorage
  ngOnInit() {
    const saved = localStorage.getItem('draft-post');
    if (saved) {
      try {
        const data = JSON.parse(saved) as FormData;
        this.formTitle.set(data.title);
        this.formContent.set(data.content);
        this.formTags.set(data.tags);
      } catch (e) {
        console.error('Failed to parse saved form data');
      }
    }
  }
}
```

### Custom Serialization

```ts
import { Component, signal } from '@angular/core';
import { syncLocalStorageEffect } from 'angular-reactive-primitives';

interface ComplexData {
  date: Date;
  values: Map<string, number>;
}

@Component({
  selector: 'custom-serialization',
  template: `<div>Custom data with Date and Map</div>`,
})
export class CustomSerializationComponent {
  complexData = signal<ComplexData>({
    date: new Date(),
    values: new Map([
      ['a', 1],
      ['b', 2],
    ]),
  });

  constructor() {
    syncLocalStorageEffect({
      signal: this.complexData,
      key: 'complex-data',
      // Custom serialization for complex types
      serialize: (value) => {
        return JSON.stringify({
          date: value.date.toISOString(),
          values: Array.from(value.values.entries()),
        });
      },
    });
  }
}
```

### Shopping Cart Persistence

```ts
import { Component, signal } from '@angular/core';
import { syncLocalStorageEffect } from 'angular-reactive-primitives';

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

@Component({
  selector: 'shopping-cart',
  template: `
    <div class="cart">
      <h2>Shopping Cart ({{ itemCount() }} items)</h2>
      @for (item of cart(); track item.id) {
        <div class="cart-item">
          <span>{{ item.name }}</span>
          <span>{{ item.quantity }}x</span>
          <span>${{ item.price }}</span>
        </div>
      }
      <div class="total">Total: ${{ totalPrice() }}</div>
    </div>
  `,
})
export class ShoppingCartComponent {
  cart = signal<CartItem[]>([]);

  itemCount = computed(() =>
    this.cart().reduce((sum, item) => sum + item.quantity, 0),
  );

  totalPrice = computed(() =>
    this.cart().reduce((sum, item) => sum + item.price * item.quantity, 0),
  );

  constructor() {
    // Persist cart to localStorage
    syncLocalStorageEffect({
      signal: this.cart,
      key: 'shopping-cart',
    });

    // Load cart from localStorage on init
    this.loadCart();
  }

  private loadCart() {
    const saved = localStorage.getItem('shopping-cart');
    if (saved) {
      try {
        const items = JSON.parse(saved) as CartItem[];
        this.cart.set(items);
      } catch (e) {
        console.error('Failed to load cart');
      }
    }
  }

  addItem(item: CartItem) {
    this.cart.update((items) => [...items, item]);
  }

  removeItem(id: string) {
    this.cart.update((items) => items.filter((item) => item.id !== id));
  }
}
```
