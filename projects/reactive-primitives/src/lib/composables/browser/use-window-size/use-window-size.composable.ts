import { signal, inject } from '@angular/core';
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
      const win = document.defaultView;

      if (win) {
        return {
          width: win.innerWidth,
          height: win.innerHeight,
        };
      }

      const root = document.documentElement;
      return {
        width: root?.clientWidth ?? 0,
        height: root?.clientHeight ?? 0,
      };
    };

    const windowSizeSignal = signal<WindowSize>(getWindowSize());
    const handleResize = () => {
      const next = getWindowSize();
      const current = windowSizeSignal();
      if (current.width !== next.width || current.height !== next.height) {
        windowSizeSignal.set(next);
      }
    };

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
