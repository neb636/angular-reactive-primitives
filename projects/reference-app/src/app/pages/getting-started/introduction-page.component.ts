import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-introduction-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="doc-page">
      <div class="doc-content">
        <h1 class="doc-title">Angular Reactive Primitives</h1>
        <p class="doc-description">
          A collection of composables and effects for modern Angular applications using reactive patterns.
          These utilities help you build more maintainable and testable applications with less boilerplate.
        </p>
        
        <div class="doc-section">
          <h2>What are Reactive Primitives?</h2>
          <p>
            Reactive Primitives are small, focused utilities that provide common reactive patterns
            for Angular applications. They are designed to work seamlessly with Angular's signal-based
            reactivity system and provide a consistent API for common use cases.
          </p>
          <p>
            Each primitive is a standalone function that can be imported and used in your components,
            making them easy to test and reuse across your application.
          </p>
        </div>

        <div class="doc-section">
          <h2>Key Features</h2>
          <ul>
            <li><strong>Signal-based:</strong> Built on Angular's signal system for optimal performance</li>
            <li><strong>Type-safe:</strong> Full TypeScript support with comprehensive type definitions</li>
            <li><strong>Tree-shakable:</strong> Import only what you need</li>
            <li><strong>Framework agnostic:</strong> Work with any Angular version that supports signals</li>
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
  styles: [`
    .doc-page {
      padding: 48px;
      max-width: 800px;
    }

    .doc-title {
      font-size: 48px;
      font-weight: 700;
      color: #1a1a1a;
      margin: 0 0 16px 0;
      line-height: 1.1;
    }

    .doc-description {
      font-size: 20px;
      color: #6b7280;
      margin: 0 0 48px 0;
      line-height: 1.6;
    }

    .doc-section {
      margin-bottom: 48px;
    }

    .doc-section h2 {
      font-size: 24px;
      font-weight: 600;
      color: #374151;
      margin: 0 0 16px 0;
    }

    .doc-section p {
      font-size: 16px;
      color: #6b7280;
      margin: 0 0 16px 0;
      line-height: 1.6;
    }

    .doc-section ul {
      margin: 0;
      padding-left: 24px;
    }

    .doc-section li {
      font-size: 16px;
      color: #6b7280;
      margin-bottom: 8px;
      line-height: 1.6;
    }

    .doc-button {
      display: inline-block;
      background: #8b5cf6;
      color: white;
      padding: 12px 24px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 500;
      transition: background 0.2s;
    }

    .doc-button:hover {
      background: #7c3aed;
    }
  `],
})
export class IntroductionPageComponent {}
