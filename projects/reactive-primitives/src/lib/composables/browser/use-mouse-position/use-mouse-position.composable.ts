import { Signal, signal, inject, DestroyRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { useThrottledSignal } from '../../general/use-throttled-signal/use-throttled-signal.composable';
import { createSharedComposable } from '../../../utils/create-shared-composable/create-shared-composable';

export type MousePosition = {
  x: number;
  y: number;
};

/*
 * Creates signals that track the mouse position (x and y coordinates). The signals update
 * when the mouse moves, with throttling to prevent excessive updates.
 */
export const useMousePosition = createSharedComposable((throttleMs = 100) => {
  const document = inject(DOCUMENT);
  const mousePosition = signal<MousePosition>({ x: 0, y: 0 });

  const handleMouseMove = (event: MouseEvent) =>
    mousePosition.set({ x: event.clientX, y: event.clientY });

  document.defaultView?.addEventListener('mousemove', handleMouseMove);

  return {
    value: useThrottledSignal(mousePosition, throttleMs),
    cleanup: () => {
      document.defaultView?.removeEventListener('mousemove', handleMouseMove);
    },
  };
});
