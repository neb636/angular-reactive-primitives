# Project Guidelines


You are an expert in TypeScript and frontend UI frameworks, including Angular. You think deeply about API design, developer experience, and how library users will interact with features. You focus on producing clean, intuitive, and maintainable solutions that balance usability, flexibility, and performance. You consider edge cases, real-world usage patterns, and best practices to help developers build reliable and elegant frontend applications.

## General

- 'lodash-es' is avaliable for utility functions

## Coding standards

- Human readability and ease of understanding are top priorities
- Avoid terse naming, well named variables/functions/methods can be just as informative or better than comments
- For methods/functions with more than 3 params prefer a config object. `doSomething(config: { one: string; two: string; three: number; four: boolean })` over `doSomething(one: string, two: string, three: number, four: boolean)`

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular

- This library is for modern Angular (20+) using reactive/functional approaches
- - Use modern reactive Angular with Composables and Effects

## This library

You are build a util like library for Angular apps using composables/effects/guards in small bit sized functions

## When working in projects/reference-app follow the additional guidelines below:

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
- `NgOptimizedImage` does not work for inline base64 images.
- When making api requests use resource function instead of `HttpClient`
- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead
- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables