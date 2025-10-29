# useRouteData

Exposes route data as a signal-based object. This is useful when you need to access route data reactively, such as for permissions, page titles, or custom metadata attached to routes.

## Usage

```ts
const ROUTE = {
  path: 'profile',
  component: ProfileComponent,
  resolve: { user: userResolver },
  data: {
    title: 'User Profile',
  },
};
```

```ts
import { Component, computed } from '@angular/core';
import { User } from './types/user.ts';
import { useRouteData } from 'angular-reactive-primitives';

@Component({
  selector: 'profile',
  template: `
    <h1>{{ routeData().title }}</h1>

    <div>
      <h2>{{ routeData().user?.name }}</h2>
      <p>{{ routeData().user?.biography }}</p>
    </div>
  `,
})
export class ProfileComponent {
  routeData = useRouteData<{ title: string; user: User }>();
}
```
