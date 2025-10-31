import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
``;
import { DocumentationSectionComponent } from '../../../common/layout/documentation-section/documentation-section.component';
import { DocumentationComponent } from '../../../common/layout/documentation/documentation.component';

@Component({
  selector: 'introduction-page',
  imports: [RouterLink, DocumentationSectionComponent, DocumentationComponent],
  template: `
    <documentation>
      <ng-container documentation-title>Angular Reactive Primitives</ng-container>
      <ng-container documentation-description>
        A utility library of small, composable building blocks for modern reactive Angular 20+
        applications. Built on Angular's simple and powerful signal implementation, these primitives
        extend Angular's base reactivity with focused helper functions that compose seamlessly
        together.
      </ng-container>

      <documentation-section>
        <ng-container section-title>What are Reactive Primitives?</ng-container>
        <p>
          Reactive Primitives are generic building blocks—small utility functions and effects—that
          extend Angular's signal-based reactivity system. Rather than solving specific use cases,
          these primitives provide flexible, extendable foundations that you can compose to build
          exactly what your application needs.
        </p>
        <p>
          Angular's signal implementation is simple and powerful. This library builds on that
          foundation with focused helpers that integrate naturally with Angular's existing
          reactivity model. Each primitive is a standalone function that can be imported and used
          independently, making them easy to test, reuse, and combine across your application.
        </p>
      </documentation-section>

      <documentation-section>
        <ng-container section-title>Key Features</ng-container>

        <ul>
          <li>
            <strong>Small & Focused:</strong> Each primitive does one thing well, encouraging clear
            composition over heavy abstractions
          </li>
          <li>
            <strong>Flexible:</strong> Generic building blocks that adapt to your specific needs
            rather than prescribing solutions
          </li>
          <li>
            <strong>Extendable:</strong> Built on Angular's signals and effects, easily customized
            and extended for your use cases
          </li>
          <li>
            <strong>Signal-based:</strong> Leverages Angular's signal system for optimal
            performance and reactivity
          </li>
          <li>
            <strong>SSR Compatible:</strong> Designed to work seamlessly with Angular's server-side
            rendering capabilities
          </li>
          <li>
            <strong>Type-safe:</strong> Full TypeScript support with comprehensive type definitions
          </li>
          <li><strong>Tree-shakable:</strong> Import only what you need, keep bundles lean</li>
          <li>
            <strong>Modern Angular:</strong> Built for Angular 20+ with reactive/functional
            approaches and composables
          </li>
        </ul>
      </documentation-section>

      <documentation-section>
        <ng-container section-title>Getting Started</ng-container>
        <p>
          Start by installing the library and then explore the composables and effects available.
          Each primitive includes detailed documentation with examples and use cases.
        </p>
        <a routerLink="/install" class="doc-button">Get Started</a>
      </documentation-section>
    </documentation>
  `,
  styleUrls: ['./introduction-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntroductionPageComponent {}
