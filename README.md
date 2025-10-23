# Angular Reactive Primitives

A collection of small, reusable reactive primitives for modern Angular (v20+) applications. Currently these
are not published and more of a scratch pad for you to copy and paste the ones you need into your applications.

## Signal Transformations

[useDebouncedSignal](composables/use-debounced-signal.composable.ts) - Creates a debounced signal from a source signal

[useThrottledSignal](composables/use-throttled-signal.composable.ts) - Creates a throttled signal from a source signal

[usePreviousSignal](composables/use-previous-signal.composable.ts) - Tracks the previous value of a signal

## Browser APIs

[useMediaQuery](composables/browser/use-media-query.composable.ts) - Tracks whether a media query matches

[useWindowSize](composables/browser/use-window-size.composable.ts) - Tracks window dimensions with resize events

[useDocumentVisibility](composables/browser/use-document-visibility.composable.ts) - Tracks whether the document/tab is visible

## Routing

[useQueryParameters](composables/activated-route/use-query-parameters.composable.ts) - Get all query parameters as a signal

[useQueryParameter](composables/activated-route/use-query-parameters.composable.ts) - Get a single query parameter as a signal

[useParameters](composables/activated-route/use-parameters.composable.ts) - Get all route parameters as a signal

[useParameter](composables/activated-route/use-parameters.composable.ts) - Get a single route parameter as a signal

[useRouteFragment](composables/activated-route/use-route-fragment.composable.ts) - Get the route fragment as a signal

[useRouteData](composables/activated-route/use-route-data.composable.ts) - Get route data as a signal

## Effects

[syncQueryParamsEffect](effects/sync-query-params.effect.ts) - Syncs query params with application state

[syncLocalStorageEffect](effects/sync-local-storage.effect.ts) - One-way sync from signal to localStorage

[logChangesEffect](effects/log-changes.effect.ts) - Development helper to log signal changes
