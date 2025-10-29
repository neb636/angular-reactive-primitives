import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocumentationComponent } from '../../common/layout/documentation/documentation.component';
import { DocumentationSectionComponent } from '../../common/layout/documentation-section/documentation-section.component';
import { CodeBlockComponent } from '../../common/components/code-block/code-block.component';

@Component({
  selector: 'use-debounced-signal-page',
  imports: [
    DocumentationComponent,
    DocumentationSectionComponent,
    CodeBlockComponent,
  ],
  template: `
    <documentation>
      <ng-container documentation-title>useDebouncedSignal</ng-container>

      <ng-container documentation-description>
        Creates a debounced signal from a source signal. Useful for things like search inputs where you want to debounce the input value before making an API call.
      </ng-container>

      <documentation-section>
        <ng-container section-title>Usage</ng-container>

        <code-block title="Search Input Example" [code]="code_usage_0" />

        <code-block title="Form Input Debouncing" [code]="code_usage_1" />
      </documentation-section>

      <documentation-section>
        <ng-container section-title>Source Code</ng-container>
        <code-block title="useDebouncedSignal Source" [code]="sourceCode" />
      </documentation-section>
    </documentation>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UseDebouncedSignalPageComponent {
  code_usage_0 = `import { Component, signal, effect } from '@angular/core';
import { useDebouncedSignal } from 'angular-reactive-primitives';

@Component({
  selector: 'search-box',
  template: \`
    <input [(ngModel)]="searchInput" placeholder="Search..." />
    @if (isSearching()) {
      <div>Searching...</div>
    }
    @if (searchResults().length > 0) {
      @for (result of searchResults(); track result.id) {
        <div>{{ result.title }}</div>
      }
    }
  \`,
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
      const results = await fetch(\`/api/search?q=\${query}\`).then((r) =>
        r.json(),
      );
      this.searchResults.set(results);
    } finally {
      this.isSearching.set(false);
    }
  }
}`;

  code_usage_1 = `import { Component, signal, effect } from '@angular/core';
import { useDebouncedSignal } from 'angular-reactive-primitives';

@Component({
  selector: 'auto-save-form',
  template: \`
    <form>
      <textarea
        [(ngModel)]="formContent"
        placeholder="Type something..."
      ></textarea>
      <div class="status">
        {{ saveStatus() }}
      </div>
    </form>
  \`,
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
}`;

  sourceCode = `import { Signal, effect, signal } from '@angular/core';
import debounce from 'lodash-es/debounce';

/*
 * Creates a debounced signal from a source signal. Useful for things like search inputs where
 * you want to debounce the input value before making an API call.
 *
 * @param sourceSignal - The source signal to debounce.
 * @param delayMs - The debounce delay in milliseconds (default: 300).
 *
 * Example:
 *
 * const searchInputText = signal('');
 *
 * // Create a debounced signal for searchInputText
 * const debouncedSearchInputText = useDebouncedSignal(searchInputText, 500);
 */
export function useDebouncedSignal<T>(sourceSignal: Signal<T>, delayMs: number = 300): Signal<T> {
  const debouncedSignal = signal<T>(sourceSignal());

  const debouncedUpdate = debounce((value: T) => {
    debouncedSignal.set(value);
  }, delayMs);

  effect(() => {
    const value = sourceSignal();
    debouncedUpdate(value);
  });

  return debouncedSignal.asReadonly();
}
`;
}
