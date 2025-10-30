import { effect } from '@angular/core';
import { useRouteFragment } from '../../../../../../reactive-primitives/src/lib/composables/route/use-route-fragment/use-route-fragment.composable';

export const scrollToFragmentOnUpdateEffect = (topOffset = 0) => {
  const routeFragment = useRouteFragment();

  return effect(() => {
    const fragment = routeFragment();

    if (fragment) {
      const element = document.getElementById(fragment);

      if (element) {
        const top =
          element.getBoundingClientRect().top + window.pageYOffset - topOffset;

        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  });
};
