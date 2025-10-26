import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-introduction-page',
  imports: [RouterLink],
  template: `
    <div class="doc-page">
      <div class="doc-content">
        <h1 class="doc-title">Angular Reactive Primitives</h1>
        <p class="doc-description">
          A collection of composables and effects for modern Angular applications using reactive
          patterns. These utilities help you build more maintainable and testable applications with
          less boilerplate.
        </p>

        <div class="doc-section">
          <h2>What are Reactive Primitives?</h2>
          <p>
            Reactive Primitives are small, focused utilities that provide common reactive patterns
            for Angular applications. They are designed to work seamlessly with Angular's
            signal-based reactivity system and provide a consistent API for common use cases.
          </p>
          <p>
            Each primitive is a standalone function that can be imported and used in your
            components, making them easy to test and reuse across your application.
          </p>
        </div>

        <div class="doc-section">
          <h2>Key Features</h2>
          <ul>
            <li>
              <strong>Signal-based:</strong> Built on Angular's signal system for optimal
              performance
            </li>
            <li>
              <strong>Type-safe:</strong> Full TypeScript support with comprehensive type
              definitions
            </li>
            <li><strong>Tree-shakable:</strong> Import only what you need</li>
            <li>
              <strong>Framework agnostic:</strong> Work with any Angular version that supports
              signals
            </li>
            <li><strong>Well-tested:</strong> Comprehensive test coverage for reliability</li>
          </ul>
        </div>

        <div class="doc-section">
          <h2>Getting Started</h2>
          <p>
            Start by installing the library and then explore the composables and effects available.
            Each primitive includes detailed documentation with examples and use cases.
          </p>
          <a routerLink="/install" class="doc-button">Get Started</a>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./introduction-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntroductionPageComponent {}
