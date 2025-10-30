import { Signal, signal, inject, DestroyRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { useDebouncedSignal } from '../../general/use-debounced-signal/use-debounced-signal.composable';
import { createSharedComposable } from '../../../utils/create-shared-composable/create-shared-composable';

export type WindowSize = {
  width: number;
  height: number;
};

/*
 * Creates signals that track the window size (width and height). The signals update
 * when the window is resized, with debouncing to prevent excessive updates.
 *
 * @param debounceMs - Debounce delay for resize events (default: 100ms)
 *
 * Example:
 *
 * const windowSize = useWindowSize();
 * const { width, height } = windowSize();
 */
export const useWindowSize = createSharedComposable(
  (debounceMs: number = 100) => {
    const document = inject(DOCUMENT);

    const getWindowSize = (): WindowSize => {
      const defaultView = document.defaultView;
      if (defaultView) {
        return {
          width: defaultView.innerWidth,
          height: defaultView.innerHeight,
        };
      }

      // Fallback for environments where defaultView is null (e.g., SSR)
      const documentElement = document.documentElement as HTMLElement | null;
      return {
        width: documentElement?.clientWidth ?? 0,
        height: documentElement?.clientHeight ?? 0,
      };
    };

    const windowSizeSignal = signal<WindowSize>(getWindowSize());
    const handleResize = () => windowSizeSignal.set(getWindowSize());

    // Listen for resize events
    document.defaultView?.addEventListener('resize', handleResize);

    // Debounce the signal to prevent excessive updates
    return {
      value: useDebouncedSignal(windowSizeSignal, debounceMs),
      cleanup: () => {
        document.defaultView?.removeEventListener('resize', handleResize);
      },
    };
  },
);
