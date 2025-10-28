export const sourceCode = `import { computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

export const useParameters = <T extends { [key: string]: undefined | string }>() => {
  const route = inject(ActivatedRoute);
  const paramMapSignal = toSignal(route.paramMap, { initialValue: route.snapshot.paramMap });

  return computed(() =>
    paramMapSignal().keys.reduce(
      (params, key) => ({ ...params, [key]: paramMapSignal().get(key) }),
      {} as T,
    ),
  );
};

export const useParameter = <T extends undefined | string>(paramName: string) => {
  const parameters = useParameters();

  return computed(() => parameters()[paramName] as T);
};`;

export const exampleCode = `import { Component, effect } from '@angular/core';
import { useParameters, useParameter } from '@angular/reactive-primitives';

@Component({
  selector: 'user-profile',
  template: \`
    <div>
      <h1>User Profile</h1>
      @if (userId()) {
        <p>User ID: {{ userId() }}</p>
      }
      @if (tabName()) {
        <p>Current Tab: {{ tabName() }}</p>
      }
    </div>
  \`
})
export class UserProfileComponent {
  // Get all parameters as an object
  params = useParameters<{ userId: string; tabName?: string }>();

  // Or get a specific parameter
  userId = useParameter<string>('userId');
  tabName = useParameter<string | undefined>('tabName');

  constructor() {
    effect(() => {
      console.log('All params:', this.params());
      console.log('User ID:', this.userId());
      console.log('Tab Name:', this.tabName());
    });
  }
}

// Route configuration:
// { path: 'user/:userId/:tabName', component: UserProfileComponent }`;
