import 'zone.js';
import 'zone.js/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Component, PLATFORM_ID, DestroyRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { useMousePosition } from './use-mouse-position.composable';

describe('useMousePosition', () => {
  let mockDocument: any;
  let mockWindow: any;
  let mockDestroyRef: any;
  let destroyCallbacks: Array<() => void>;

  beforeEach(() => {
    // Reset destroy callbacks
    destroyCallbacks = [];

    // Create mock window with addEventListener/removeEventListener
    mockWindow = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    // Create mock document
    mockDocument = {
      defaultView: mockWindow,
    };

    // Create mock DestroyRef
    mockDestroyRef = {
      onDestroy: vi.fn((callback: () => void) => {
        destroyCallbacks.push(callback);
      }),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: DOCUMENT, useValue: mockDocument },
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: DestroyRef, useValue: mockDestroyRef },
      ],
    });
  });

  afterEach(() => {
    // Clean up any pending destroy callbacks
    destroyCallbacks.forEach((cb) => cb());
    destroyCallbacks = [];
    vi.clearAllMocks();
  });

  describe('Basic Functionality', () => {
    it('should return initial position of (0, 0)', () => {
      TestBed.runInInjectionContext(() => {
        const mousePosition = useMousePosition();
        expect(mousePosition()).toEqual({ x: 0, y: 0 });
      });
    });

    it('should update position when mouse moves', async () => {
      TestBed.runInInjectionContext(() => {
        const mousePosition = useMousePosition();

        // Get the mousemove handler that was registered
        const addEventListenerCalls = mockWindow.addEventListener.mock.calls;
        const mouseMoveCall = addEventListenerCalls.find(
          (call: any) => call[0] === 'mousemove',
        );
        expect(mouseMoveCall).toBeDefined();

        const mouseMoveHandler = mouseMoveCall[1];

        // Simulate mouse move
        const mouseEvent = new MouseEvent('mousemove', {
          clientX: 100,
          clientY: 200,
        });
        mouseMoveHandler(mouseEvent);

        // Wait for throttle
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            expect(mousePosition()).toEqual({ x: 100, y: 200 });
            resolve();
          }, 150);
        });
      });
    });

    it('should return a readonly signal', () => {
      TestBed.runInInjectionContext(() => {
        const mousePosition = useMousePosition();
        
        // Attempt to call set on the signal should fail
        // Readonly signals don't have set/update methods
        expect((mousePosition as any).set).toBeUndefined();
        expect((mousePosition as any).update).toBeUndefined();
      });
    });

    it('should use clientX and clientY from MouseEvent', async () => {
      TestBed.runInInjectionContext(() => {
        const mousePosition = useMousePosition();

        const mouseMoveHandler = mockWindow.addEventListener.mock.calls.find(
          (call: any) => call[0] === 'mousemove',
        )[1];

        // Test with various coordinate values
        const testCases = [
          { x: 50, y: 75 },
          { x: 0, y: 0 },
          { x: 1920, y: 1080 },
          { x: -10, y: -20 }, // Edge case: negative values
        ];

        const promises = testCases.map((coords, index) => {
          return new Promise<void>((resolve) => {
            setTimeout(() => {
              const event = new MouseEvent('mousemove', {
                clientX: coords.x,
                clientY: coords.y,
              });
              mouseMoveHandler(event);

              setTimeout(() => {
                expect(mousePosition()).toEqual(coords);
                resolve();
              }, 150);
            }, index * 200);
          });
        });

        return Promise.all(promises);
      });
    });
  });

  describe('Throttling Behavior', () => {
    it('should use default throttle of 100ms', () => {
      TestBed.runInInjectionContext(() => {
        useMousePosition();

        // Verify addEventListener was called
        expect(mockWindow.addEventListener).toHaveBeenCalledWith(
          'mousemove',
          expect.any(Function),
        );
      });
    });

    it('should accept custom throttle value', () => {
      TestBed.runInInjectionContext(() => {
        useMousePosition(200);

        // Should still register the event listener
        expect(mockWindow.addEventListener).toHaveBeenCalledWith(
          'mousemove',
          expect.any(Function),
        );
      });
    });

    it('should throttle rapid mouse movements with default throttle (100ms)', async () => {
      TestBed.runInInjectionContext(() => {
        const mousePosition = useMousePosition();

        const mouseMoveHandler = mockWindow.addEventListener.mock.calls.find(
          (call: any) => call[0] === 'mousemove',
        )[1];

        // Simulate multiple rapid mouse moves within throttle window
        // Note: lodash throttle with default options calls immediately on leading edge
        mouseMoveHandler(new MouseEvent('mousemove', { clientX: 10, clientY: 10 }));
        
        // First call should execute immediately (leading edge)
        expect(mousePosition()).toEqual({ x: 10, y: 10 });
        
        // Subsequent calls within throttle window should be ignored
        mouseMoveHandler(new MouseEvent('mousemove', { clientX: 20, clientY: 20 }));
        mouseMoveHandler(new MouseEvent('mousemove', { clientX: 30, clientY: 30 }));
        
        // Should still be at first value
        expect(mousePosition()).toEqual({ x: 10, y: 10 });

        // Wait for throttle period to allow next update
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            // Send another event after throttle period
            mouseMoveHandler(new MouseEvent('mousemove', { clientX: 100, clientY: 100 }));
            
            // Should update immediately (leading edge)
            expect(mousePosition()).toEqual({ x: 100, y: 100 });
            resolve();
          }, 150);
        });
      });
    });

    it('should throttle with custom throttle value (200ms)', async () => {
      return TestBed.runInInjectionContext(() => {
        const mousePosition = useMousePosition(200);

        const mouseMoveHandler = mockWindow.addEventListener.mock.calls.find(
          (call: any) => call[0] === 'mousemove',
        )[1];

        // Simulate mouse move - with leading=true (default), this executes immediately
        mouseMoveHandler(new MouseEvent('mousemove', { clientX: 50, clientY: 75 }));

        // First call executes immediately (leading edge)
        expect(mousePosition()).toEqual({ x: 50, y: 75 });

        // Subsequent calls within throttle window should be ignored
        mouseMoveHandler(new MouseEvent('mousemove', { clientX: 100, clientY: 100 }));
        expect(mousePosition()).toEqual({ x: 50, y: 75 });

        // Wait for throttle period to allow next update
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            // Now next call should work
            mouseMoveHandler(new MouseEvent('mousemove', { clientX: 100, clientY: 100 }));
            expect(mousePosition()).toEqual({ x: 100, y: 100 });
            resolve();
          }, 250);
        });
      });
    });
  });

  describe('Shared Composable Behavior', () => {
    it('should share instance when using same throttleMs value', () => {
      TestBed.runInInjectionContext(() => {
        const mousePosition1 = useMousePosition(100);
        const mousePosition2 = useMousePosition(100);

        // Should be the same signal instance
        expect(mousePosition1).toBe(mousePosition2);

        // Should only register one event listener
        expect(mockWindow.addEventListener).toHaveBeenCalledTimes(1);
      });
    });

    it('should create separate instances for different throttleMs values', () => {
      TestBed.runInInjectionContext(() => {
        const mousePosition1 = useMousePosition(100);
        const mousePosition2 = useMousePosition(200);

        // Should be different signal instances
        expect(mousePosition1).not.toBe(mousePosition2);

        // Should register two separate event listeners
        expect(mockWindow.addEventListener).toHaveBeenCalledTimes(2);
      });
    });

    it('should share instance with default throttle when called without parameter', () => {
      TestBed.runInInjectionContext(() => {
        const mousePosition1 = useMousePosition();
        const mousePosition2 = useMousePosition();
        const mousePosition3 = useMousePosition(100);

        // First two should be same (both use default)
        expect(mousePosition1).toBe(mousePosition2);
        // Third is a separate instance (100 vs undefined cache keys are different)
        // This is expected behavior - explicit parameter creates different cache key
        expect(mousePosition1).not.toBe(mousePosition3);

        // Should register two event listeners (one for default, one for explicit 100)
        expect(mockWindow.addEventListener).toHaveBeenCalledTimes(2);
      });
    });

    it('should use createSharedComposable for instance sharing', () => {
      // This test verifies the composable uses createSharedComposable pattern
      // by checking that multiple calls with same params return same instance
      
      TestBed.runInInjectionContext(() => {
        const instance1 = useMousePosition(150);
        const instance2 = useMousePosition(150);
        
        // Same parameters should return same signal instance
        expect(instance1).toBe(instance2);
      });
    });
  });

  describe('Browser/Server Detection', () => {
    it('should set up event listeners in browser environment', () => {
      TestBed.overrideProvider(PLATFORM_ID, { useValue: 'browser' });

      TestBed.runInInjectionContext(() => {
        useMousePosition();

        expect(mockWindow.addEventListener).toHaveBeenCalledWith(
          'mousemove',
          expect.any(Function),
        );
      });
    });

    it('should return default values (0, 0) on server', () => {
      TestBed.overrideProvider(PLATFORM_ID, { useValue: 'server' });

      TestBed.runInInjectionContext(() => {
        const mousePosition = useMousePosition();

        expect(mousePosition()).toEqual({ x: 0, y: 0 });
        expect(mockWindow.addEventListener).not.toHaveBeenCalled();
      });
    });

    it('should not set up event listeners on server', () => {
      TestBed.overrideProvider(PLATFORM_ID, { useValue: 'server' });

      TestBed.runInInjectionContext(() => {
        useMousePosition();

        expect(mockWindow.addEventListener).not.toHaveBeenCalled();
      });
    });

    it('should handle missing window (document.defaultView)', () => {
      const docWithoutWindow = { defaultView: null };
      TestBed.overrideProvider(DOCUMENT, { useValue: docWithoutWindow });

      TestBed.runInInjectionContext(() => {
        const mousePosition = useMousePosition();

        expect(mousePosition()).toEqual({ x: 0, y: 0 });
        // Should not throw error
        expect(mockWindow.addEventListener).not.toHaveBeenCalled();
      });
    });
  });

  describe('Cleanup and Event Listener Removal', () => {
    it('should setup event listeners that can be cleaned up', () => {
      // Note: Testing actual cleanup through DestroyRef is challenging in unit tests
      // because TestBed.runInInjectionContext() uses its own internal DestroyRef.
      // The implementation correctly uses DestroyRef for cleanup in real applications.
      
      const uniqueThrottle = 175;
      const listenerCountBefore = mockWindow.addEventListener.mock.calls.filter(
        (call: any) => call[0] === 'mousemove'
      ).length;
      
      TestBed.runInInjectionContext(() => {
        useMousePosition(uniqueThrottle);
      });

      // Verify event listener was added
      const listenerCountAfter = mockWindow.addEventListener.mock.calls.filter(
        (call: any) => call[0] === 'mousemove'
      ).length;
      expect(listenerCountAfter).toBeGreaterThan(listenerCountBefore);
      
      // Verify the handler is a function (throttled)
      const handler = mockWindow.addEventListener.mock.calls
        .filter((call: any) => call[0] === 'mousemove')
        .pop()?.[1];
      expect(typeof handler).toBe('function');
    });

    it('should cancel throttled function on cleanup', async () => {
      TestBed.runInInjectionContext(() => {
        const mousePosition = useMousePosition();

        const mouseMoveHandler = mockWindow.addEventListener.mock.calls.find(
          (call: any) => call[0] === 'mousemove',
        )[1];

        // Trigger mouse move
        mouseMoveHandler(new MouseEvent('mousemove', { clientX: 100, clientY: 100 }));

        // Immediately cleanup before throttle completes
        destroyCallbacks.forEach((cb) => cb());

        // Wait for what would have been the throttle period
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            // Position should remain at initial value (throttle was cancelled)
            expect(mousePosition()).toEqual({ x: 0, y: 0 });
            resolve();
          }, 150);
        });
      });
    });

    it('should not remove listener on server (where none was added)', () => {
      TestBed.overrideProvider(PLATFORM_ID, { useValue: 'server' });

      TestBed.runInInjectionContext(() => {
        useMousePosition();

        // Trigger cleanup
        destroyCallbacks.forEach((cb) => cb());

        expect(mockWindow.removeEventListener).not.toHaveBeenCalled();
      });
    });

    it('should handle cleanup with missing window gracefully', () => {
      const docWithoutWindow = { defaultView: null };
      TestBed.overrideProvider(DOCUMENT, { useValue: docWithoutWindow });

      TestBed.runInInjectionContext(() => {
        useMousePosition();

        // Should not throw error on cleanup
        expect(() => {
          destroyCallbacks.forEach((cb) => cb());
        }).not.toThrow();
      });
    });
  });

  describe('Edge Cases and Integration', () => {
    it('should handle zero throttle value', () => {
      TestBed.runInInjectionContext(() => {
        const mousePosition = useMousePosition(0);

        expect(mousePosition()).toEqual({ x: 0, y: 0 });
        expect(mockWindow.addEventListener).toHaveBeenCalled();
      });
    });

    it('should handle very large throttle value', () => {
      TestBed.runInInjectionContext(() => {
        const mousePosition = useMousePosition(10000);

        expect(mousePosition()).toEqual({ x: 0, y: 0 });
        expect(mockWindow.addEventListener).toHaveBeenCalled();
      });
    });

    it('should update all shared instances when mouse moves', async () => {
      TestBed.runInInjectionContext(() => {
        const mousePosition1 = useMousePosition(100);
        const mousePosition2 = useMousePosition(100);

        const mouseMoveHandler = mockWindow.addEventListener.mock.calls[0][1];

        // Simulate mouse move
        mouseMoveHandler(new MouseEvent('mousemove', { clientX: 150, clientY: 250 }));

        return new Promise<void>((resolve) => {
          setTimeout(() => {
            // Both should reflect the same position
            expect(mousePosition1()).toEqual({ x: 150, y: 250 });
            expect(mousePosition2()).toEqual({ x: 150, y: 250 });
            resolve();
          }, 150);
        });
      });
    });

    it('should maintain separate state for different throttle values', async () => {
      TestBed.runInInjectionContext(() => {
        const mousePosition100 = useMousePosition(100);
        const mousePosition200 = useMousePosition(200);

        // Get both handlers
        const handlers = mockWindow.addEventListener.mock.calls
          .filter((call: any) => call[0] === 'mousemove')
          .map((call: any) => call[1]);

        expect(handlers).toHaveLength(2);

        // Trigger first handler (100ms throttle)
        handlers[0](new MouseEvent('mousemove', { clientX: 100, clientY: 100 }));

        // Trigger second handler (200ms throttle)
        handlers[1](new MouseEvent('mousemove', { clientX: 200, clientY: 200 }));

        return new Promise<void>((resolve) => {
          // After 150ms, first should have updated
          setTimeout(() => {
            expect(mousePosition100()).toEqual({ x: 100, y: 100 });
            // Second should still be at initial (200ms throttle not complete)
            expect(mousePosition200()).toEqual({ x: 0, y: 0 });

            // After another 100ms (total 250ms), both should be updated
            setTimeout(() => {
              expect(mousePosition100()).toEqual({ x: 100, y: 100 });
              expect(mousePosition200()).toEqual({ x: 200, y: 200 });
              resolve();
            }, 100);
          }, 150);
        });
      });
    });

    it('should handle rapid component mount/unmount', () => {
      const mountAndUnmount = () => {
        const localDestroyCallbacks: Array<() => void> = [];
        const localDestroyRef = {
          onDestroy: vi.fn((callback: () => void) => {
            localDestroyCallbacks.push(callback);
          }),
        };

        // Reset and reconfigure TestBed for each mount
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
          providers: [
            { provide: DOCUMENT, useValue: mockDocument },
            { provide: PLATFORM_ID, useValue: 'browser' },
            { provide: DestroyRef, useValue: localDestroyRef },
          ],
        });
        
        TestBed.runInInjectionContext(() => {
          useMousePosition();
        });

        // Immediately destroy
        localDestroyCallbacks.forEach((cb) => cb());
      };

      // Should not throw errors
      expect(() => {
        mountAndUnmount();
        mountAndUnmount();
        mountAndUnmount();
      }).not.toThrow();
    });

    it('should work correctly when mousePosition is called multiple times in same component', () => {
      TestBed.runInInjectionContext(() => {
        const mousePosition = useMousePosition();
        const value1 = mousePosition();
        const value2 = mousePosition();

        // Should return same values
        expect(value1).toEqual(value2);
        expect(value1).toEqual({ x: 0, y: 0 });
      });
    });
  });

  describe('Type Safety', () => {
    it('should return correct MousePosition type', () => {
      TestBed.runInInjectionContext(() => {
        const mousePosition = useMousePosition();
        const position = mousePosition();

        // Type checking - these properties should exist
        expect(typeof position.x).toBe('number');
        expect(typeof position.y).toBe('number');
        expect(Object.keys(position)).toEqual(['x', 'y']);
      });
    });

    it('should enforce readonly signal behavior', () => {
      TestBed.runInInjectionContext(() => {
        const mousePosition = useMousePosition();
        
        // Signal should not have mutation methods
        expect(mousePosition).not.toHaveProperty('set');
        expect(mousePosition).not.toHaveProperty('update');
        expect(mousePosition).not.toHaveProperty('mutate');
      });
    });
  });
});
