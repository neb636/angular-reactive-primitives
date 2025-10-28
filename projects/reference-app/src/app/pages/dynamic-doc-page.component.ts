import {
  ChangeDetectionStrategy,
  Component,
  input,
  inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { DocumentationComponent } from '../common/layout/documentation/documentation.component';
import { DocumentationSectionComponent } from '../common/layout/documentation-section/documentation-section.component';
import { ParametersComponent } from '../common/components/parameters/parameters.component';
import { CodeBlockComponent } from '../common/components/code-block/code-block.component';
import { DocEntry } from 'reactive-primitives';

@Component({
  selector: 'dynamic-doc-page',
  imports: [
    DocumentationComponent,
    DocumentationSectionComponent,
    ParametersComponent,
    CodeBlockComponent,
  ],
  template: `
    @if (docEntry(); as doc) {
      <documentation>
        <ng-container documentation-title>{{
          doc.metadata.title
        }}</ng-container>

        <ng-container documentation-description>
          {{ doc.metadata.description }}
        </ng-container>

        <parameters [parameters]="doc.metadata.parameters"></parameters>

        @if (doc.metadata.returnType) {
          <documentation-section>
            <ng-container section-title>Returns</ng-container>
            <div class="return-type">
              <code>{{ doc.metadata.returnType }}</code>
              @if (doc.metadata.returnDescription) {
                <p>{{ doc.metadata.returnDescription }}</p>
              }
            </div>
          </documentation-section>
        }

        <documentation-section>
          <ng-container section-title>Source Code</ng-container>
          <code-block
            [title]="doc.metadata.title + ' Source'"
            [code]="doc.sourceCode"
          />
        </documentation-section>

        <documentation-section>
          <ng-container section-title>Example Usage</ng-container>
          <code-block title="Example Usage" [code]="doc.exampleCode" />
        </documentation-section>
      </documentation>
    } @else {
      <div class="error-message">
        <h1>Documentation Not Found</h1>
        <p>The requested documentation could not be loaded.</p>
      </div>
    }
  `,
  styles: [
    `
      .return-type {
        margin-top: 1rem;
      }

      .return-type code {
        display: inline-block;
        padding: 0.25rem 0.5rem;
        background: var(--color-code-bg, #f5f5f5);
        border-radius: 4px;
        font-family: monospace;
        font-size: 0.9em;
      }

      .return-type p {
        margin-top: 0.5rem;
        color: var(--color-text-secondary, #666);
      }

      .error-message {
        padding: 2rem;
        text-align: center;
      }

      .error-message h1 {
        color: var(--color-error, #d32f2f);
        margin-bottom: 1rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicDocPageComponent {
  private route = inject(ActivatedRoute);

  // Get docEntry from route data
  docEntry = toSignal(
    this.route.data.pipe(map((data) => data['docEntry'] as DocEntry)),
    { requireSync: true },
  );
}
