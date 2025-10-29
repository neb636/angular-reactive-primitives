# useDebouncedSignal

Creates a debounced signal from a source signal. Useful for things like search inputs where you want to debounce the input value before making an API call.

## Usage

### Search Input Example

```ts
import { Component, signal, effect } from '@angular/core';
import { useDebouncedSignal } from 'angular-reactive-primitives';

@Component({
  selector: 'search-box',
  template: `
    <input [(ngModel)]="searchInput" placeholder="Search..." />
    @if (isSearching()) {
      <div>Searching...</div>
    }
    @if (searchResults().length > 0) {
      @for (result of searchResults(); track result.id) {
        <div>{{ result.title }}</div>
      }
    }
  `,
})
export class SearchBoxComponent {
  searchInput = signal('');
  debouncedSearch = useDebouncedSignal(this.searchInput, 500);
  isSearching = signal(false);
  searchResults = signal<any[]>([]);

  constructor() {
    effect(() => {
      const query = this.debouncedSearch();
      if (query.length > 2) {
        this.performSearch(query);
      }
    });
  }

  private async performSearch(query: string) {
    this.isSearching.set(true);
    try {
      const results = await fetch(`/api/search?q=${query}`).then((r) =>
        r.json(),
      );
      this.searchResults.set(results);
    } finally {
      this.isSearching.set(false);
    }
  }
}
```

### Form Input Debouncing

```ts
import { Component, signal, effect } from '@angular/core';
import { useDebouncedSignal } from 'angular-reactive-primitives';

@Component({
  selector: 'auto-save-form',
  template: `
    <form>
      <textarea
        [(ngModel)]="formContent"
        placeholder="Type something..."
      ></textarea>
      <div class="status">
        {{ saveStatus() }}
      </div>
    </form>
  `,
})
export class AutoSaveFormComponent {
  formContent = signal('');
  debouncedContent = useDebouncedSignal(this.formContent, 1000);
  saveStatus = signal('All changes saved');

  constructor() {
    effect(() => {
      const content = this.debouncedContent();
      if (content) {
        this.autoSave(content);
      }
    });
  }

  private async autoSave(content: string) {
    this.saveStatus.set('Saving...');
    try {
      await fetch('/api/save', {
        method: 'POST',
        body: JSON.stringify({ content }),
      });
      this.saveStatus.set('All changes saved');
    } catch (error) {
      this.saveStatus.set('Failed to save');
    }
  }
}
```
