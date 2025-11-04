import { TestBed } from '@angular/core/testing';
import { Component, signal, ElementRef, viewChild } from '@angular/core';
import { useElementBounding } from './use-element-bounding.composable';

describe('useElementBounding', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should return default values when element is null', () => {
    @Component({
      template: '',
    })
    class TestComponent {
      elementSignal = signal<Element | null>(null);
      bounding = useElementBounding(this.elementSignal);
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const bounding = fixture.componentInstance.bounding();
    expect(bounding.x).toBe(0);
    expect(bounding.y).toBe(0);
    expect(bounding.width).toBe(0);
    expect(bounding.height).toBe(0);
    expect(bounding.top).toBe(0);
    expect(bounding.right).toBe(0);
    expect(bounding.bottom).toBe(0);
    expect(bounding.left).toBe(0);
  });

  it('should track element bounding box', () => {
    @Component({
      template: '<div #myDiv style="width: 100px; height: 50px;"></div>',
    })
    class TestComponent {
      divRef = viewChild<ElementRef<HTMLDivElement>>('myDiv');
      bounding = useElementBounding(this.divRef);
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const bounding = fixture.componentInstance.bounding();
    expect(bounding.width).toBe(100);
    expect(bounding.height).toBe(50);
    expect(typeof bounding.x).toBe('number');
    expect(typeof bounding.y).toBe('number');
  });

  it('should work with Element directly (not ElementRef)', () => {
    @Component({
      template: '<div #myDiv style="width: 200px; height: 100px;"></div>',
    })
    class TestComponent {
      divRef = viewChild<ElementRef<HTMLDivElement>>('myDiv');
      elementSignal = signal<Element | null>(null);
      bounding = useElementBounding(this.elementSignal);

      ngAfterViewInit() {
        const element = this.divRef()?.nativeElement;
        if (element) {
          this.elementSignal.set(element);
        }
      }
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const bounding = fixture.componentInstance.bounding();
    expect(bounding.width).toBe(200);
    expect(bounding.height).toBe(100);
  });

  it('should update when element changes', (done) => {
    @Component({
      template: `
        <div #div1 style="width: 100px; height: 50px;"></div>
        <div #div2 style="width: 200px; height: 100px;"></div>
      `,
    })
    class TestComponent {
      div1Ref = viewChild<ElementRef<HTMLDivElement>>('div1');
      div2Ref = viewChild<ElementRef<HTMLDivElement>>('div2');
      elementSignal = signal<ElementRef | null>(null);
      bounding = useElementBounding(this.elementSignal);
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;

    // Set to first element
    component.elementSignal.set(component.div1Ref()!);
    fixture.detectChanges();

    setTimeout(() => {
      let bounding = component.bounding();
      expect(bounding.width).toBe(100);
      expect(bounding.height).toBe(50);

      // Change to second element
      component.elementSignal.set(component.div2Ref()!);
      fixture.detectChanges();

      setTimeout(() => {
        bounding = component.bounding();
        expect(bounding.width).toBe(200);
        expect(bounding.height).toBe(100);
        done();
      }, 50);
    }, 50);
  });

  it('should handle element becoming null', (done) => {
    @Component({
      template: '<div #myDiv style="width: 100px; height: 50px;"></div>',
    })
    class TestComponent {
      divRef = viewChild<ElementRef<HTMLDivElement>>('myDiv');
      elementSignal = signal<ElementRef | null>(null);
      bounding = useElementBounding(this.elementSignal);
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;

    // Set element
    component.elementSignal.set(component.divRef()!);
    fixture.detectChanges();

    setTimeout(() => {
      let bounding = component.bounding();
      expect(bounding.width).toBe(100);

      // Set to null
      component.elementSignal.set(null);
      fixture.detectChanges();

      setTimeout(() => {
        bounding = component.bounding();
        expect(bounding.width).toBe(0);
        expect(bounding.height).toBe(0);
        done();
      }, 50);
    }, 50);
  });

  it('should provide an update method', () => {
    @Component({
      template: '<div #myDiv style="width: 100px; height: 50px;"></div>',
    })
    class TestComponent {
      divRef = viewChild<ElementRef<HTMLDivElement>>('myDiv');
      bounding = useElementBounding(this.divRef);
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const bounding = fixture.componentInstance.bounding();
    expect(typeof bounding.update).toBe('function');

    // Should not throw
    bounding.update();
  });

  it('should manually update bounding when update() is called', (done) => {
    @Component({
      template: '<div #myDiv style="width: 100px; height: 50px;"></div>',
    })
    class TestComponent {
      divRef = viewChild<ElementRef<HTMLDivElement>>('myDiv');
      bounding = useElementBounding(this.divRef, {
        windowResize: false,
        windowScroll: false,
      });
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    const element = component.divRef()!.nativeElement;

    // Initial values
    let bounding = component.bounding();
    const initialWidth = bounding.width;
    expect(initialWidth).toBe(100);

    // Change element size
    element.style.width = '300px';

    // Size shouldn't update automatically (listeners disabled)
    setTimeout(() => {
      bounding = component.bounding();
      expect(bounding.width).toBe(100); // Still old value

      // Manual update
      bounding.update();

      setTimeout(() => {
        bounding = component.bounding();
        expect(bounding.width).toBe(300); // Updated!
        done();
      }, 50);
    }, 50);
  });

  it('should respect custom throttle configuration', () => {
    @Component({
      template: '<div #myDiv></div>',
    })
    class TestComponent {
      divRef = viewChild<ElementRef<HTMLDivElement>>('myDiv');
      bounding = useElementBounding(this.divRef, { throttleMs: 500 });
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    // Should create without errors with custom throttle
    const bounding = fixture.componentInstance.bounding();
    expect(bounding).toBeDefined();
  });

  it('should respect windowResize: false configuration', () => {
    @Component({
      template: '<div #myDiv></div>',
    })
    class TestComponent {
      divRef = viewChild<ElementRef<HTMLDivElement>>('myDiv');
      bounding = useElementBounding(this.divRef, { windowResize: false });
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const bounding = fixture.componentInstance.bounding();
    expect(bounding).toBeDefined();
  });

  it('should respect windowScroll: false configuration', () => {
    @Component({
      template: '<div #myDiv></div>',
    })
    class TestComponent {
      divRef = viewChild<ElementRef<HTMLDivElement>>('myDiv');
      bounding = useElementBounding(this.divRef, { windowScroll: false });
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const bounding = fixture.componentInstance.bounding();
    expect(bounding).toBeDefined();
  });

  it('should handle multiple components using the composable independently', () => {
    @Component({
      template: '<div #myDiv style="width: 100px; height: 50px;"></div>',
    })
    class TestComponent1 {
      divRef = viewChild<ElementRef<HTMLDivElement>>('myDiv');
      bounding = useElementBounding(this.divRef);
    }

    @Component({
      template: '<div #myDiv style="width: 200px; height: 100px;"></div>',
    })
    class TestComponent2 {
      divRef = viewChild<ElementRef<HTMLDivElement>>('myDiv');
      bounding = useElementBounding(this.divRef);
    }

    const fixture1 = TestBed.createComponent(TestComponent1);
    const fixture2 = TestBed.createComponent(TestComponent2);

    fixture1.detectChanges();
    fixture2.detectChanges();

    const bounding1 = fixture1.componentInstance.bounding();
    const bounding2 = fixture2.componentInstance.bounding();

    expect(bounding1.width).toBe(100);
    expect(bounding1.height).toBe(50);
    expect(bounding2.width).toBe(200);
    expect(bounding2.height).toBe(100);
  });

  it('should return readonly signal', () => {
    @Component({
      template: '<div #myDiv></div>',
    })
    class TestComponent {
      divRef = viewChild<ElementRef<HTMLDivElement>>('myDiv');
      bounding = useElementBounding(this.divRef);
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const bounding = fixture.componentInstance.bounding;

    // Should not have .set() method (readonly signal)
    expect((bounding as any).set).toBeUndefined();
  });

  it('should handle undefined element signal', () => {
    @Component({
      template: '',
    })
    class TestComponent {
      elementSignal = signal<Element | undefined>(undefined);
      bounding = useElementBounding(this.elementSignal);
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const bounding = fixture.componentInstance.bounding();
    expect(bounding.x).toBe(0);
    expect(bounding.y).toBe(0);
    expect(bounding.width).toBe(0);
    expect(bounding.height).toBe(0);
  });

  it('should clean up observers on component destroy', () => {
    @Component({
      template: '<div #myDiv></div>',
    })
    class TestComponent {
      divRef = viewChild<ElementRef<HTMLDivElement>>('myDiv');
      bounding = useElementBounding(this.divRef);
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    // Get the bounding to ensure setup happened
    fixture.componentInstance.bounding();

    // Destroy component (should clean up without errors)
    expect(() => fixture.destroy()).not.toThrow();
  });

  it('should track position changes correctly', () => {
    @Component({
      template: `
        <div style="padding: 50px;">
          <div #myDiv style="width: 100px; height: 50px;"></div>
        </div>
      `,
    })
    class TestComponent {
      divRef = viewChild<ElementRef<HTMLDivElement>>('myDiv');
      bounding = useElementBounding(this.divRef);
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const bounding = fixture.componentInstance.bounding();

    // Element should be positioned somewhere on the page (not at 0,0)
    // The exact values depend on the test environment, but it should have valid coordinates
    expect(typeof bounding.x).toBe('number');
    expect(typeof bounding.y).toBe('number');
    expect(typeof bounding.top).toBe('number');
    expect(typeof bounding.left).toBe('number');
    expect(typeof bounding.right).toBe('number');
    expect(typeof bounding.bottom).toBe('number');

    // Verify consistency
    expect(bounding.x).toBe(bounding.left);
    expect(bounding.y).toBe(bounding.top);
  });

  it('should update position coordinates correctly', () => {
    @Component({
      template: '<div #myDiv style="width: 100px; height: 50px;"></div>',
    })
    class TestComponent {
      divRef = viewChild<ElementRef<HTMLDivElement>>('myDiv');
      bounding = useElementBounding(this.divRef);
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const bounding = fixture.componentInstance.bounding();

    // x should equal left, y should equal top
    expect(bounding.x).toBe(bounding.left);
    expect(bounding.y).toBe(bounding.top);

    // right should be left + width
    expect(bounding.right).toBeCloseTo(bounding.left + bounding.width, 1);

    // bottom should be top + height
    expect(bounding.bottom).toBeCloseTo(bounding.top + bounding.height, 1);
  });
});

