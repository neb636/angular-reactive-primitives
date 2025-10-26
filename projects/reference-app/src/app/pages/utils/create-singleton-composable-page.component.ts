import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocumentationComponent } from '../../common/layout/documentation/documentation.component';
import { DocumentationSectionComponent } from '../../common/layout/documentation-section/documentation-section.component';
import { ParametersComponent } from '../../common/components/parameters/parameters.component';
import { CodeBlockComponent } from '../../common/components/code-block/code-block.component';

@Component({
  selector: 'create-singleton-composable-page',
  imports: [
    DocumentationComponent,
    DocumentationSectionComponent,
    ParametersComponent,
    CodeBlockComponent,
  ],
  template: `
    <documentation>
      <ng-container documentation-title>createSingletonComposable</ng-container>

      <ng-container documentation-description
        >Creates a singleton composable that only executes once per root injector. Perfect for shared signals, event listeners, or any stateful logic that should be shared across multiple component instances.</ng-container
      >

      <documentation-section>
        <ng-container section-title>Overview</ng-container>
        <p>
          The createSingletonComposable utility wraps a factory function to ensure it executes only once
          per application (root injector). This is useful when you want to create shared state or resources
          that should be the same instance across all components that use it.
        </p>
        <p>
          Unlike regular composables that create a new instance each time they're called, a singleton
          composable caches its result and returns the same instance on subsequent calls. This is perfect
          for global event listeners, shared signals, or expensive operations that should only happen once.
        </p>
        <p>
          The implementation uses a WeakMap to ensure proper garbage collection when the injector is destroyed.
        </p>
      </documentation-section>

      <parameters [parameters]="parameters"></parameters>

      <documentation-section>
        <ng-container section-title>Source Code</ng-container>
        <code-block [title]="'createSingletonComposable Source'" [code]="sourceCode" />
      </documentation-section>

      <documentation-section>
        <ng-container section-title>Example Usage</ng-container>
        <code-block title="Example Usage" [code]="exampleCode" />
      </documentation-section>
    </documentation>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateSingletonComposablePageComponent {
  parameters = [
    {
      name: 'factory',
      type: '() => T',
      description: 'A factory function that creates the singleton value. This function will only execute once per injector.',
    },
  ];

  sourceCode = `import { inject, Injector } from '@angular/core';

/**
 * Creates a singleton composable that only executes once per root injector.
 * Perfect for shared signals, event listeners, or any stateful logic that should
 * be shared across multiple component instances.
 *
 * @example
 * \`\`\`typescript
 * export const useOnlineStatus = createSingletonComposable(() => {
 *   const destroyRef = inject(DestroyRef);
 *   const isOnline = signal(navigator.onLine);
 *   const updateStatus = () => isOnline.set(navigator.onLine);
 *
 *   window.addEventListener('online', updateStatus);
 *   window.addEventListener('offline', updateStatus);
 *
 *   destroyRef.onDestroy(() => {
 *     window.removeEventListener('online', updateStatus);
 *     window.removeEventListener('offline', updateStatus);
 *   });
 *
 *   return isOnline.asReadonly();
 * });
 *
 * // Usage: Can be called 10,000 times, but logic runs once
 * const isOnline = useOnlineStatus();
 * \`\`\`
 */
export function createSingletonComposable<T>(factory: () => T): () => T {
  // WeakMap ensures garbage collection when injector is destroyed
  const cache = new WeakMap<Injector, T>();

  return (): T => {
    // Get the root injector to ensure app-wide singleton
    const injector = inject(Injector);

    // Check if we've already created the value for this injector
    if (!cache.has(injector)) {
      // Execute the factory function once and cache the result
      cache.set(injector, factory());
    }

    return cache.get(injector)!;
  };
}`;

  exampleCode = `import { signal, inject, DestroyRef } from '@angular/core';
import { createSingletonComposable } from '@angular/reactive-primitives';

// Example 1: Shared online/offline status
export const useOnlineStatus = createSingletonComposable(() => {
  const destroyRef = inject(DestroyRef);
  const isOnline = signal(navigator.onLine);

  const updateStatus = () => {
    isOnline.set(navigator.onLine);
  };

  window.addEventListener('online', updateStatus);
  window.addEventListener('offline', updateStatus);

  destroyRef.onDestroy(() => {
    window.removeEventListener('online', updateStatus);
    window.removeEventListener('offline', updateStatus);
  });

  return isOnline.asReadonly();
});

// Usage in multiple components - all share the same signal
@Component({
  selector: 'header',
  template: \`
    @if (!isOnline()) {
      <div class="offline-banner">You are offline</div>
    }
  \`
})
export class HeaderComponent {
  isOnline = useOnlineStatus(); // Same instance as below
}

@Component({
  selector: 'footer',
  template: \`
    <div>Status: {{ isOnline() ? 'Online' : 'Offline' }}</div>
  \`
})
export class FooterComponent {
  isOnline = useOnlineStatus(); // Same instance as above
}

// Example 2: Shared theme state
export const useTheme = createSingletonComposable(() => {
  const theme = signal<'light' | 'dark'>('light');

  const toggleTheme = () => {
    theme.update(current => current === 'light' ? 'dark' : 'light');
  };

  return {
    theme: theme.asReadonly(),
    toggleTheme,
  };
});

@Component({
  selector: 'theme-toggle',
  template: \`
    <button (click)="toggleTheme()">
      Toggle Theme ({{ theme() }})
    </button>
  \`
})
export class ThemeToggleComponent {
  private themeService = useTheme();
  theme = this.themeService.theme;
  toggleTheme = this.themeService.toggleTheme;
}

@Component({
  selector: 'app-layout',
  template: \`
    <div [class]="theme() + '-theme'">
      <ng-content></ng-content>
    </div>
  \`
})
export class AppLayoutComponent {
  theme = useTheme().theme;
}

// Example 3: Shared WebSocket connection
export const useWebSocket = createSingletonComposable(() => {
  const destroyRef = inject(DestroyRef);
  const messages = signal<string[]>([]);
  const isConnected = signal(false);

  const ws = new WebSocket('wss://example.com/socket');

  ws.onopen = () => {
    isConnected.set(true);
  };

  ws.onmessage = (event) => {
    messages.update(msgs => [...msgs, event.data]);
  };

  ws.onclose = () => {
    isConnected.set(false);
  };

  const sendMessage = (message: string) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  };

  destroyRef.onDestroy(() => {
    ws.close();
  });

  return {
    messages: messages.asReadonly(),
    isConnected: isConnected.asReadonly(),
    sendMessage,
  };
});

// All components share the same WebSocket connection
@Component({
  selector: 'chat-messages',
  template: \`
    @for (message of messages(); track $index) {
      <div>{{ message }}</div>
    }
  \`
})
export class ChatMessagesComponent {
  private ws = useWebSocket();
  messages = this.ws.messages;
}

@Component({
  selector: 'chat-input',
  template: \`
    <input #input type="text" />
    <button (click)="send(input.value); input.value = ''">Send</button>
  \`
})
export class ChatInputComponent {
  private ws = useWebSocket();
  send = this.ws.sendMessage;
}`;
}
