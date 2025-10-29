import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import bash from 'highlight.js/lib/languages/bash';

// Register languages
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('css', css);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('shell', bash);

@Component({
  selector: 'code-block',
  template: `
    <div class="code-block">
      @if (title()) {
        <div class="code-header">
          <span>{{ title() }}</span>
          <button
            class="copy-button"
            type="button"
            (click)="copy()"
            [attr.aria-label]="'Copy ' + title()"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
              />
            </svg>
          </button>
        </div>
      }
      <pre><code class="hljs" [innerHTML]="highlightedCode()"></code></pre>
    </div>
  `,
  styleUrls: ['./code-block.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeBlockComponent {
  title = input<string | undefined>('');
  code = input<string | undefined>('');
  language = input<string>('typescript');

  private readonly sanitizer = inject(DomSanitizer);

  highlightedCode = computed<SafeHtml>(() => {
    const codeValue = this.code() || '';
    const lang = this.language();

    if (!codeValue) {
      return '';
    }

    try {
      const highlighted = hljs.highlight(codeValue, {
        language: lang,
        ignoreIllegals: true,
      }).value;
      return this.sanitizer.sanitize(1, highlighted) || '';
    } catch (error) {
      // Fallback to auto-detection if language is not recognized
      try {
        const highlighted = hljs.highlightAuto(codeValue).value;
        return this.sanitizer.sanitize(1, highlighted) || '';
      } catch {
        // If all else fails, return plain text
        return codeValue;
      }
    }
  });

  copy(): void {
    const value = this.code();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(value || '').catch(() => {
        // no-op fallback if clipboard is not available
      });
    }
  }
}
