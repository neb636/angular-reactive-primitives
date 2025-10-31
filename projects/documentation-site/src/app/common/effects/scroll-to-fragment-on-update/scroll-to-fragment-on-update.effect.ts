import { effect } from '@angular/core';
import { useRouteFragment } from 'angular-reactive-primitives';

export const scrollToFragmentOnUpdateEffect = () => {
  const routeFragment = useRouteFragment();

  return effect(() => {
    const fragment = routeFragment();

    if (fragment) {
      document.getElementById(fragment)?.scrollIntoView({ behavior: 'smooth' });
    }
  });
};
