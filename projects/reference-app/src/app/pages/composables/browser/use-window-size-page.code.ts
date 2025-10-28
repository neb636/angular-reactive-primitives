export const exampleCode =
  `import { Component, computed, effect } from '@angular/core';
import { useWindowSize } from '@angular/reactive-primitives';


// Another example: Adaptive column layout
@Component({
  selector: 'grid-layout',
  template: ` +
  '`' +
  `
    <div [style.grid-template-columns]="gridColumns()">
      @for (item of items; track item.id) {
        <div class="grid-item">{{ item.name }}</div>
      }
    </div>
  ` +
  '`' +
  `
})
export class GridLayoutComponent {
  windowSize = useWindowSize();

  // Dynamically adjust grid columns based on window width
  gridColumns = computed(() => {
    const width = this.windowSize().width;
    if (width < 640) return 'repeat(1, 1fr)';
    if (width < 1024) return 'repeat(2, 1fr)';
    if (width < 1280) return 'repeat(3, 1fr)';
    return 'repeat(4, 1fr)';
  });

  items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
    { id: 4, name: 'Item 4' },
  ];
}

// Example: Conditional rendering based on aspect ratio
@Component({
  selector: 'aspect-aware-layout',
  template: ` +
  '`' +
  `
    @if (isWideScreen()) {
      <two-column-layout />
    } @else {
      <single-column-layout />
    }
  ` +
  '`' +
  `
})
export class AspectAwareLayoutComponent {
  windowSize = useWindowSize();

  isWideScreen = computed(() => {
    const { width, height } = this.windowSize();
    return width / height > 1.5;
  });
}`;
