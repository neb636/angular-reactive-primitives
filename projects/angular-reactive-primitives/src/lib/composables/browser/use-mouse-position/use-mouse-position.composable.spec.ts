import { TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection, PLATFORM_ID } from '@angular/core';
import { useMousePosition } from './use-mouse-position.composable';

describe('useMousePosition', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('should return default mouse position (0, 0) on initialization', () => {
    @Component({
      template: '',
    })
    class TestComponent {
      mousePosition = useMousePosition();
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const position = fixture.componentInstance.mousePosition();
    expect(position.x).toBe(0);
    expect(position.y).toBe(0);
  });

  it('should update mouse position on mousemove event with default throttle (100ms)', (done) => {
    @Component({
      template: '',
    })
    class TestComponent {
      mousePosition = useMousePosition();
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;

    // Simulate mouse move event
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: 100,
      clientY: 200,
    });
    window.dispatchEvent(mouseEvent);

    // Wait for throttle delay (default 100ms) + buffer
    setTimeout(() => {
      const position = component.mousePosition();
      expect(position.x).toBe(100);
      expect(position.y).toBe(200);
      done();
    }, 150);
  });

  it('should support custom throttle values', (done) => {
    @Component({
      template: '',
    })
    class TestComponent {
      mousePosition = useMousePosition(200);
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;

    // Simulate mouse move event
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: 150,
      clientY: 250,
    });
    window.dispatchEvent(mouseEvent);

    // Should not update before throttle delay
    setTimeout(() => {
      const position = component.mousePosition();
      expect(position.x).toBe(0);
      expect(position.y).toBe(0);
    }, 100);

    // Should update after throttle delay (200ms) + buffer
    setTimeout(() => {
      const position = component.mousePosition();
      expect(position.x).toBe(150);
      expect(position.y).toBe(250);
      done();
    }, 250);
  });

  it('should throttle multiple rapid mousemove events', (done) => {
    @Component({
      template: '',
    })
    class TestComponent {
      mousePosition = useMousePosition(100);
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;

    // Dispatch multiple events rapidly
    for (let i = 1; i <= 10; i++) {
      const mouseEvent = new MouseEvent('mousemove', {
        clientX: i * 10,
        clientY: i * 10,
      });
      window.dispatchEvent(mouseEvent);
    }

    // Wait for throttle delay
    setTimeout(() => {
      const position = component.mousePosition();
      // Should capture the last event (100, 100) due to throttling
      expect(position.x).toBe(100);
      expect(position.y).toBe(100);
      done();
    }, 150);
  });

  it('should return readonly signal that cannot be directly modified', () => {
    @Component({
      template: '',
    })
    class TestComponent {
      mousePosition = useMousePosition();
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const mousePosition = fixture.componentInstance.mousePosition;

    // Should not have .set() method (readonly signal)
    expect((mousePosition as any).set).toBeUndefined();
  });

  it('should share instance between components with same throttleMs value', (done) => {
    @Component({
      selector: 'test-component-shared-1',
      template: '',
    })
    class TestComponent1 {
      mousePosition = useMousePosition(); // default 100ms
    }

    @Component({
      selector: 'test-component-shared-2',
      template: '',
    })
    class TestComponent2 {
      mousePosition = useMousePosition(); // default 100ms
    }

    const fixture1 = TestBed.createComponent(TestComponent1);
    const fixture2 = TestBed.createComponent(TestComponent2);

    fixture1.detectChanges();
    fixture2.detectChanges();

    // Simulate mouse move event
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: 300,
      clientY: 400,
    });
    window.dispatchEvent(mouseEvent);

    // Wait for throttle
    setTimeout(() => {
      const position1 = fixture1.componentInstance.mousePosition();
      const position2 = fixture2.componentInstance.mousePosition();

      // Both should have the same values (shared instance)
      expect(position1.x).toBe(300);
      expect(position1.y).toBe(400);
      expect(position2.x).toBe(300);
      expect(position2.y).toBe(400);
      done();
    }, 150);
  });

  it('should create separate instances for different throttleMs values', (done) => {
    @Component({
      selector: 'test-component-separate-1',
      template: '',
    })
    class TestComponent1 {
      mousePosition = useMousePosition(50); // 50ms throttle
    }

    @Component({
      selector: 'test-component-separate-2',
      template: '',
    })
    class TestComponent2 {
      mousePosition = useMousePosition(200); // 200ms throttle
    }

    const fixture1 = TestBed.createComponent(TestComponent1);
    const fixture2 = TestBed.createComponent(TestComponent2);

    fixture1.detectChanges();
    fixture2.detectChanges();

    // Simulate mouse move event
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: 500,
      clientY: 600,
    });
    window.dispatchEvent(mouseEvent);

    // Check after 100ms - component1 (50ms throttle) should update, component2 (200ms throttle) should not
    setTimeout(() => {
      const position1 = fixture1.componentInstance.mousePosition();
      const position2 = fixture2.componentInstance.mousePosition();

      expect(position1.x).toBe(500);
      expect(position1.y).toBe(600);
      expect(position2.x).toBe(0); // Not updated yet due to longer throttle
      expect(position2.y).toBe(0);

      // Check after 250ms - both should be updated
      setTimeout(() => {
        const position2Updated = fixture2.componentInstance.mousePosition();
        expect(position2Updated.x).toBe(500);
        expect(position2Updated.y).toBe(600);
        done();
      }, 200);
    }, 100);
  });

  it('should clean up event listeners on component destroy', () => {
    @Component({
      template: '',
    })
    class TestComponent {
      mousePosition = useMousePosition();
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    // Get the mouse position to ensure setup happened
    fixture.componentInstance.mousePosition();

    // Destroy component (should clean up without errors)
    expect(() => fixture.destroy()).not.toThrow();
  });

  it('should handle server-side rendering (returns default values)', () => {
    // Override PLATFORM_ID to simulate server environment
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: PLATFORM_ID, useValue: 'server' },
      ],
    });

    @Component({
      template: '',
    })
    class TestComponent {
      mousePosition = useMousePosition();
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const position = fixture.componentInstance.mousePosition();
    
    // Should return default values on server
    expect(position.x).toBe(0);
    expect(position.y).toBe(0);
  });

  it('should not set up event listeners on server', (done) => {
    // Override PLATFORM_ID to simulate server environment
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: PLATFORM_ID, useValue: 'server' },
      ],
    });

    @Component({
      template: '',
    })
    class TestComponent {
      mousePosition = useMousePosition();
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;

    // Simulate mouse move event
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: 700,
      clientY: 800,
    });
    window.dispatchEvent(mouseEvent);

    // Wait for potential throttle
    setTimeout(() => {
      const position = component.mousePosition();
      
      // Should still be at default values (no event listener set up on server)
      expect(position.x).toBe(0);
      expect(position.y).toBe(0);
      done();
    }, 150);
  });

  it('should handle zero throttle value', (done) => {
    @Component({
      template: '',
    })
    class TestComponent {
      mousePosition = useMousePosition(0);
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;

    // Simulate mouse move event
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: 50,
      clientY: 75,
    });
    window.dispatchEvent(mouseEvent);

    // With 0ms throttle, should update immediately (or very quickly)
    setTimeout(() => {
      const position = component.mousePosition();
      expect(position.x).toBe(50);
      expect(position.y).toBe(75);
      done();
    }, 50);
  });

  it('should update continuously as mouse moves', (done) => {
    @Component({
      template: '',
    })
    class TestComponent {
      mousePosition = useMousePosition(50);
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;

    // First movement
    let mouseEvent = new MouseEvent('mousemove', {
      clientX: 10,
      clientY: 20,
    });
    window.dispatchEvent(mouseEvent);

    setTimeout(() => {
      let position = component.mousePosition();
      expect(position.x).toBe(10);
      expect(position.y).toBe(20);

      // Second movement
      mouseEvent = new MouseEvent('mousemove', {
        clientX: 30,
        clientY: 40,
      });
      window.dispatchEvent(mouseEvent);

      setTimeout(() => {
        position = component.mousePosition();
        expect(position.x).toBe(30);
        expect(position.y).toBe(40);

        // Third movement
        mouseEvent = new MouseEvent('mousemove', {
          clientX: 50,
          clientY: 60,
        });
        window.dispatchEvent(mouseEvent);

        setTimeout(() => {
          position = component.mousePosition();
          expect(position.x).toBe(50);
          expect(position.y).toBe(60);
          done();
        }, 100);
      }, 100);
    }, 100);
  });

  it('should handle negative coordinates', (done) => {
    @Component({
      template: '',
    })
    class TestComponent {
      mousePosition = useMousePosition();
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;

    // Simulate mouse move with negative coordinates (edge case but possible)
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: -10,
      clientY: -20,
    });
    window.dispatchEvent(mouseEvent);

    setTimeout(() => {
      const position = component.mousePosition();
      expect(position.x).toBe(-10);
      expect(position.y).toBe(-20);
      done();
    }, 150);
  });

  it('should handle very large coordinate values', (done) => {
    @Component({
      template: '',
    })
    class TestComponent {
      mousePosition = useMousePosition();
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;

    // Simulate mouse move with large coordinates
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: 99999,
      clientY: 88888,
    });
    window.dispatchEvent(mouseEvent);

    setTimeout(() => {
      const position = component.mousePosition();
      expect(position.x).toBe(99999);
      expect(position.y).toBe(88888);
      done();
    }, 150);
  });

  it('should handle multiple components with different throttle values independently', (done) => {
    @Component({
      template: '',
    })
    class TestComponent1 {
      mousePosition1 = useMousePosition(100);
      mousePosition2 = useMousePosition(100); // Same throttle - should share
      mousePosition3 = useMousePosition(300); // Different throttle - separate instance
    }

    const fixture = TestBed.createComponent(TestComponent1);
    fixture.detectChanges();

    const component = fixture.componentInstance;

    // Simulate mouse move
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: 111,
      clientY: 222,
    });
    window.dispatchEvent(mouseEvent);

    // Check after 150ms - mousePosition1 and mousePosition2 should update, mousePosition3 should not
    setTimeout(() => {
      const pos1 = component.mousePosition1();
      const pos2 = component.mousePosition2();
      const pos3 = component.mousePosition3();

      expect(pos1.x).toBe(111);
      expect(pos1.y).toBe(222);
      expect(pos2.x).toBe(111); // Same as pos1 (shared instance)
      expect(pos2.y).toBe(222);
      expect(pos3.x).toBe(0); // Not updated yet
      expect(pos3.y).toBe(0);

      // Check after 350ms - all should be updated
      setTimeout(() => {
        const pos3Updated = component.mousePosition3();
        expect(pos3Updated.x).toBe(111);
        expect(pos3Updated.y).toBe(222);
        done();
      }, 250);
    }, 150);
  });
});

