import { ChangeDetectionStrategy, Component, input } from '@angular/core';






@Component({
  selector: 'app-code-block',
  // standalone is default in Angular 17+/20+, do not set explicitly
  template: `
    <div class="code-block">
      <div class="code-header">
        <span>{{ title() }}</span>
        <button class="copy-button" type="button" (click)="copy()" [attr.aria-label]="'Copy ' + title()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
          </svg>
        </button>
      </div>
      <pre><code>{{ code() || '' }}</code></pre>
    </div>
  `,
  styleUrls: ['./code-block.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeBlockComponent {
   title = input<string | undefined>('');
   code = input<string | undefined>('');

  copy(): void {
    const value = this.code();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(value || '').catch(() => {
        // no-op fallback if clipboard is not available
      });
    }
  }
}
