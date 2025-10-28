import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
  model,
  contentChildren,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tab',
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabComponent {
  label = input.required<string>();
}

@Component({
  selector: 'tab-group',
  imports: [CommonModule, TabComponent],
  styleUrls: ['./tab-group.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="tabs-container">
      <div class="tabs-header">
        @for (tab of tabs(); track $index) {
          <button
            class="tab-button"
            [class.active]="selectedIndex() === $index"
            role="tab"
            [attr.aria-selected]="selectedIndex() === $index"
            [attr.aria-controls]="'tab-panel-' + $index"
            [id]="'tab-' + $index"
            (click)="selectTab($index)"
            type="button"
          >
            {{ tab.label() }}
          </button>
        }
      </div>

      <div class="tabs-content">
        @for (tab of tabs(); track $index) {
          @if (selectedIndex() === $index) {
            <div
              class="tab-panel"
              role="tabpanel"
              [attr.aria-labelledby]="'tab-' + $index"
              [id]="'tab-panel-' + $index"
            >
              <ng-content select="tab" />
            </div>
          }
        }
      </div>
    </div>
  `,
})
export class TabGroupComponent {
  tabs = contentChildren(TabComponent);
  selectedIndex = model<number>(0);
  selectedIndexChange = output<number>();

  constructor() {
    effect(() => {
      console.log('tabs', this.tabs());
    });
  }

  selectTab(index: number): void {
    this.selectedIndex.set(index);
    this.selectedIndexChange.emit(index);
  }
}
