import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CodeBlockComponent } from '../../components/code-block/code-block.component';

@Component({
  selector: 'documentation-format',
  imports: [CodeBlockComponent],
  template: `
    <div class="doc-page">
      <div class="doc-content">
        <h1 class="doc-title">{{ title() }}</h1>
        <p class="doc-description">{{ description() }}</p>

        @if (overview()) {
          <div class="doc-section">
            <h2>Overview</h2>
            <p>{{ overview() }}</p>
          </div>
        }

        @if (parameters()?.length) {
          <div class="doc-section">
            <h2>Parameters</h2>
            <div class="param-list">
              @for (param of parameters(); track param.name) {
                <div class="param-item">
                  <div class="param-name">
                    <code>{{ param.name }}</code>
                    <span class="param-type">{{ param.type }}</span>
                  </div>
                  <p class="param-description">{{ param.description }}</p>
                </div>
              }
            </div>
          </div>
        }

        @if (returns()) {
          <div class="doc-section">
            <h2>Returns</h2>
            <p>{{ returns() }}</p>
          </div>
        }

        @if (sourceCode()) {
          <div class="doc-section">
            <h2>Source Code</h2>
            <code-block [title]="title() + ' Source'" [code]="sourceCode()" />
          </div>
        }

        @if (exampleCode()) {
          <div class="doc-section">
            <h2>Example Usage</h2>
            <code-block title="Example Usage" [code]="exampleCode()" />
          </div>
        }
      </div>
    </div>
  `,
  styleUrls: ['./doc-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocPageComponent {
  title = input.required<string>();
  description = input.required<string>();
  overview = input<string | undefined>();
  parameters = input<
    Array<{ name: string; type: string; description: string }> | undefined
  >();
  returns = input<string | undefined>();
  sourceCode = input<string | undefined>();
  exampleCode = input<string | undefined>();
}
