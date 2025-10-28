# useRouteParam

A reactive utility function that wraps Angular’s ActivatedRoute.paramMap, exposing all route parameters as a signal-based object literal.

# useRouteParam

A convenience function that wraps Angular’s ActivatedRoute.params, exposing a specific parameter selected by passed (`activatedRoute.params[keyName]`) as a signal-based value.

## Usage

```ts
class ExampleComponent {
  userService = inject(UserService);

  userId = useRouteParam('userId');

  userResource = resource({
    params: () => ({ id: userId() }),
    loader: ({ params: { id }, abortSignal }) =>
      this.userService.fetchUser(id, { abortSignal }),
  });
}
```
