import { Signal, signal, computed, inject, effect, untracked } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { useDebouncedSignal } from '../../general/use-debounced-signal/use-debounced-signal.composable';

export type ElementBoundingBox = {
  x: number;
  y: number;
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
};

export type UseElementBoundingOptions = {
  /**
   * Whether to update the bounding box when the window is scrolled
   * @default false
   */
  updateOnScroll?: boolean;
  /**
   * Debounce delay for updates in milliseconds
   * @default 100
   */
  debounceMs?: number;
  /**
   * Whether to reset bounding box to zero when element is null/undefined
   * @default true
   */
  resetOnElementChange?: boolean;
};

const INITIAL_BOUNDING_BOX: ElementBoundingBox = {
  x: 0,
  y: 0,
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  width: 0,
  height: 0,
};

/**
 * Creates signals that track an element's bounding box (position and dimensions).
 * The signals update when the element is resized, and optionally when the window scrolls.
 *
 * Uses ResizeObserver for efficient element size tracking and optional scroll listening
 * for position updates.
 *
 * @param elementSignal - A signal containing the element to track
 * @param options - Configuration options
 *
 * Example:
 *
 * const elementRef = viewChild<ElementRef>('myElement');
 * const element = computed(() => elementRef()?.nativeElement);
 * const bounding = useElementBounding(element, { updateOnScroll: true });
 * const width = computed(() => bounding().width);
 */
export function useElementBounding(
  elementSignal: Signal<HTMLElement | Element | null | undefined>,
  options: UseElementBoundingOptions = {},
): Signal<ElementBoundingBox> {
  const {
    updateOnScroll = false,
    debounceMs = 100,
    resetOnElementChange = true,
  } = options;

  const document = inject(DOCUMENT);
  const boundingBox = signal<ElementBoundingBox>(INITIAL_BOUNDING_BOX);

  let resizeObserver: ResizeObserver | null = null;
  let currentElement: HTMLElement | Element | null = null;

  const updateBoundingBox = (element: HTMLElement | Element) => {
    const rect = element.getBoundingClientRect();
    boundingBox.set({
      x: rect.x,
      y: rect.y,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    });
  };

  const handleScroll = () => {
    const element = untracked(elementSignal);
    if (element) {
      updateBoundingBox(element);
    }
  };

  const setupObserver = (element: HTMLElement | Element) => {
    // Clean up existing observer
    if (resizeObserver) {
      resizeObserver.disconnect();
    }

    // Create new ResizeObserver
    resizeObserver = new ResizeObserver(() => {
      updateBoundingBox(element);
    });

    resizeObserver.observe(element);

    // Initial update
    updateBoundingBox(element);
  };

  const cleanup = () => {
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
    if (updateOnScroll) {
      document.defaultView?.removeEventListener('scroll', handleScroll, true);
    }
    currentElement = null;
  };

  // Set up scroll listener if requested
  if (updateOnScroll) {
    document.defaultView?.addEventListener('scroll', handleScroll, true);
  }

  // Watch for element changes
  effect((onCleanup) => {
    const element = elementSignal();

    if (element !== currentElement) {
      if (element) {
        setupObserver(element);
        currentElement = element;
      } else {
        cleanup();
        if (resetOnElementChange) {
          boundingBox.set(INITIAL_BOUNDING_BOX);
        }
      }
    }

    onCleanup(() => {
      cleanup();
    });
  });

  // Return debounced signal to prevent excessive updates
  return useDebouncedSignal(boundingBox, debounceMs);
}
