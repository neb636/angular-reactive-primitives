import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
``;
import { DocumentationSectionComponent } from '../../../common/layout/documentation-section/documentation-section.component';
import { DocumentationComponent } from '../../../common/layout/documentation/documentation.component';
import { OnThisPageComponent } from '../../../common/components/on-this-page/on-this-page.component';

@Component({
  selector: 'introduction-page',
  imports: [
    RouterLink,
    DocumentationSectionComponent,
    DocumentationComponent,
    OnThisPageComponent,
  ],
  template: `
    <documentation>
      <ng-container documentation-title
        >Angular Reactive Primitives</ng-container
      >
      <ng-container documentation-description>
        A collection of composables and effects for modern Angular applications
        using reactive patterns. These utilities help you build more
        maintainable and testable applications with less boilerplate.
      </ng-container>

      <documentation-section id="what-are-reactive-primitives">
        <ng-container section-title>What are Reactive Primitives?</ng-container>
        <p>
          Reactive Primitives are small, focused utilities that provide common
          reactive patterns for Angular applications. They are designed to work
          seamlessly with Angular's signal-based reactivity system and provide a
          consistent API for common use cases.
        </p>
        <p>
          Each primitive is a standalone function that can be imported and used
          in your components, making them easy to test and reuse across your
          application.
        </p>
      </documentation-section>

      <documentation-section id="key-features">
        <ng-container section-title>Key Features</ng-container>

        <ul>
          <li>
            <strong>Signal-based:</strong> Built on Angular's signal system for
            optimal performance
          </li>
          <li>
            <strong>Type-safe:</strong> Full TypeScript support with
            comprehensive type definitions
          </li>
          <li><strong>Tree-shakable:</strong> Import only what you need</li>
          <li>
            <strong>Framework agnostic:</strong> Work with any Angular version
            that supports signals
          </li>
          <li>
            <strong>Well-tested:</strong> Comprehensive test coverage for
            reliability
          </li>
        </ul>
      </documentation-section>

      <documentation-section id="getting-started">
        <ng-container section-title>Getting Started</ng-container>
        <p>
          Start by installing the library and then explore the composables and
          effects available. Each primitive includes detailed documentation with
          examples and use cases.
        </p>
        <a routerLink="/install" class="doc-button">Get Started</a>
      </documentation-section>

      <ng-container sidebar-right>
        <on-this-page [sections]="sections" />
      </ng-container>
    </documentation>
  `,
  styleUrls: ['./introduction-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntroductionPageComponent {
  sections = [
    {
      id: 'what-are-reactive-primitives',
      title: 'What are Reactive Primitives?',
    },
    {
      id: 'key-features',
      title: 'Key Features',
    },
    {
      id: 'getting-started',
      title: 'Getting Started',
    },
  ];
}
