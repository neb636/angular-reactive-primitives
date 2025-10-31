import { effect } from '@angular/core';
import { useRouteFragment } from '../../../../../../angular-reactive-primitives/src/lib/composables/route/use-route-fragment/use-route-fragment.composable';

export const scrollToFragmentOnUpdateEffect = () => {
  const routeFragment = useRouteFragment();

  return effect(() => {
    const fragment = routeFragment();

    if (fragment) {
      document.getElementById(fragment)?.scrollIntoView({ behavior: 'smooth' });
    }
  });
};
