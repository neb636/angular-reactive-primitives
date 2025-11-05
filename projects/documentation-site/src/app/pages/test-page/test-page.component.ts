import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { computed, signal } from '@angular/core';
import {
  useWindowSize,
  useMousePosition,
  useElementBounding,
  useDocumentVisibility,
  useDebouncedSignal,
  usePreviousSignal,
  useThrottledSignal,
  useRouteParams,
  useRouteParameter,
  useRouteQueryParams,
  useRouteQueryParam,
  useRouteData,
  useRouteFragment,
  syncQueryParamsEffect,
  syncLocalStorageEffect,
  createSharedComposable,
} from '../../../../../angular-reactive-primitives/src/public-api';

// Shared composable example — Clock
const useClock = createSharedComposable((intervalMs: number = 1000) => {
  const now = signal(new Date());
  const tick = signal(0);
  const intervalId = setInterval(() => {
    tick.update((v) => v + 1);
    now.set(new Date());
  }, intervalMs);
  return {
    value: { now: now.asReadonly(), tick: tick.asReadonly() },
    cleanup: () => clearInterval(intervalId),
  } as const;
});

@Component({
  selector: 'test-page',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
      }

      .test-page {
        padding: 24px;
        display: grid;
        gap: 24px;
      }

      .test-page__hero {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        flex-wrap: wrap;
      }

      .test-page__title {
        font-size: 24px;
        font-weight: 700;
        margin: 0;
      }

      .test-page__subtitle {
        color: #666;
        margin: 0;
        font-size: 14px;
      }

      .test-page__grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 16px;
      }

      .test-page__card {
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 16px;
        background: #fff;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
      }

      .test-page__card-title {
        font-size: 16px;
        font-weight: 600;
        margin: 0 0 12px 0;
      }

      .test-page__row {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
      }

      .test-page__value {
        font-family:
          ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
          'Liberation Mono', 'Courier New', monospace;
        background: #f3f4f6;
        border: 1px solid #e5e7eb;
        padding: 4px 8px;
        border-radius: 8px;
      }

      .test-page__measure-box {
        position: relative;
        min-height: 140px;
        border: 1px dashed #94a3b8;
        border-radius: 8px;
        background: #f8fafc;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #334155;
      }

      .test-page__mouse-area {
        position: relative;
        height: 180px;
        border-radius: 8px;
        border: 1px dashed #94a3b8;
        background: linear-gradient(180deg, #f8fafc, #ffffff);
        overflow: hidden;
      }

      .test-page__mouse-dot {
        position: absolute;
        width: 16px;
        height: 16px;
        border-radius: 999px;
        background: #2563eb;
        box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.15);
        pointer-events: none;
        transform: translate(-50%, -50%);
      }

      .test-page__controls {
        display: flex;
        gap: 8px;
        align-items: center;
        flex-wrap: wrap;
      }

      .test-page__input {
        appearance: none;
        border: 1px solid #e5e7eb;
        padding: 6px 10px;
        border-radius: 8px;
        font-size: 14px;
        outline: none;
      }

      .test-page__button {
        appearance: none;
        border: 1px solid #e5e7eb;
        padding: 6px 10px;
        border-radius: 8px;
        background: #111827;
        color: #fff;
        cursor: pointer;
      }
      .test-page__button:active {
        transform: translateY(1px);
      }

      .test-page__badge {
        display: inline-block;
        padding: 2px 8px;
        border-radius: 999px;
        background: #eef2ff;
        color: #3730a3;
        border: 1px solid #c7d2fe;
        font-size: 12px;
      }
    `,
  ],
  template: `
    <section class="test-page">
      <header class="test-page__hero">
        <div>
          <h1 class="test-page__title">
            Angular Reactive Primitives — Showcase
          </h1>
          <p class="test-page__subtitle">
            Clean, composable, and ergonomic reactive utilities for modern
            Angular.
          </p>
        </div>
        <div class="test-page__row">
          <span class="test-page__badge">
            @if (isDocumentVisible()) {
              Visible
            } @else {
              Hidden
            }
          </span>
          <span class="test-page__badge"
            >{{ windowSize().width }} × {{ windowSize().height }}</span
          >
        </div>
      </header>

      <div class="test-page__grid">
        <article class="test-page__card">
          <h3 class="test-page__card-title">
            Route — Params, Query, Data, Fragment
          </h3>
          <div class="test-page__row" style="margin-bottom: 12px;">
            <span class="test-page__value"
              >param.id: {{ routeParamId() ?? '—' }}</span
            >
            <span class="test-page__value"
              >params: {{ routeParams() | json }}</span
            >
          </div>
          <div class="test-page__row" style="margin-bottom: 12px;">
            <span class="test-page__value"
              >query.q: {{ queryParamQ() ?? '—' }}</span
            >
            <span class="test-page__value"
              >query: {{ queryParams() | json }}</span
            >
          </div>
          <div class="test-page__row" style="margin-bottom: 12px;">
            <span class="test-page__value">data: {{ routeData() | json }}</span>
            <span class="test-page__value"
              >fragment: {{ routeFragment() ?? '—' }}</span
            >
          </div>
          <div class="test-page__controls">
            <input
              class="test-page__input"
              placeholder="Sync q via query params"
              [value]="searchText()"
              (input)="onSearchInput($any($event.target).value)"
            />
            <button class="test-page__button" (click)="incrementCounter()">
              counter: {{ counter() }}
            </button>
          </div>
        </article>

        <article class="test-page__card">
          <h3 class="test-page__card-title">
            Signals — Debounce, Throttle, Previous
          </h3>
          <div class="test-page__controls" style="margin-bottom: 12px;">
            <input
              class="test-page__input"
              placeholder="Type to see debounced/throttled"
              [value]="searchText()"
              (input)="onSearchInput($any($event.target).value)"
            />
            <button class="test-page__button" (click)="resetSearch()">
              Reset
            </button>
          </div>
          <div class="test-page__row" style="margin-bottom: 8px;">
            <span class="test-page__value">now: {{ searchText() || '—' }}</span>
            <span class="test-page__value"
              >debounced: {{ debouncedSearchText() || '—' }}</span
            >
          </div>
          <div class="test-page__row">
            <span class="test-page__value"
              >throttled: {{ throttledSearchText() || '—' }}</span
            >
            <span class="test-page__value"
              >previous: {{ previousSearchText() ?? '—' }}</span
            >
          </div>
        </article>

        <article class="test-page__card">
          <h3 class="test-page__card-title">Mouse Position — Throttled</h3>
          <div class="test-page__mouse-area">
            <div
              class="test-page__mouse-dot"
              [style.left.px]="mousePosition().x"
              [style.top.px]="mousePosition().y"
            ></div>
          </div>
          <div class="test-page__row" style="margin-top: 12px;">
            <span class="test-page__value">x: {{ mousePosition().x }}</span>
            <span class="test-page__value">y: {{ mousePosition().y }}</span>
          </div>
        </article>

        <article class="test-page__card">
          <h3 class="test-page__card-title">
            Element Bounding — Resize/Scroll Aware
          </h3>
          <div #measureBox class="test-page__measure-box">
            <div>
              <div
                class="test-page__row"
                style="justify-content: center; margin-bottom: 8px;"
              >
                <span class="test-page__value"
                  >w: {{ boxBounding().width | number: '1.0-0' }}</span
                >
                <span class="test-page__value"
                  >h: {{ boxBounding().height | number: '1.0-0' }}</span
                >
              </div>
              <div class="test-page__row" style="justify-content: center;">
                <span class="test-page__value"
                  >x: {{ boxBounding().x | number: '1.0-0' }}</span
                >
                <span class="test-page__value"
                  >y: {{ boxBounding().y | number: '1.0-0' }}</span
                >
              </div>
            </div>
          </div>
          <div class="test-page__row" style="margin-top: 12px;">
            <button class="test-page__button" (click)="forceBoxUpdate()">
              Force update()
            </button>
          </div>
        </article>

        <article class="test-page__card">
          <h3 class="test-page__card-title">
            Shared Composable — Clock (createSharedComposable)
          </h3>
          <div class="test-page__row" style="margin-bottom: 8px;">
            <span class="test-page__value"
              >clock A: {{ clock().toLocaleTimeString() }}</span
            >
            <span class="test-page__value"
              >clock B: {{ clock().toLocaleTimeString() }}</span
            >
          </div>
          <div class="test-page__row">
            <span class="test-page__value">tick: {{ clockTick() }}</span>
            <span class="test-page__value"
              >isLargeScreen: {{ isLargeScreen() }}</span
            >
          </div>
        </article>
      </div>
    </section>
  `,
})
export class TestPageComponent {
  // View refs
  measureBoxRef = viewChild<ElementRef<HTMLDivElement>>('measureBox');

  // Browser composables
  windowSize = useWindowSize(100);
  mousePosition = useMousePosition(100);
  isDocumentVisible = useDocumentVisibility();

  // Element bounding
  boxBounding = useElementBounding(this.measureBoxRef, { throttleMs: 120 });

  // General signals
  searchText = signal('');
  debouncedSearchText = useDebouncedSignal(this.searchText, 500);
  throttledSearchText = useThrottledSignal(this.searchText, 500);
  previousSearchText = usePreviousSignal(this.searchText);

  counter = signal(0);
  previousCounter = usePreviousSignal(this.counter);

  // Route composables
  routeParams = useRouteParams<Record<string, string | null>>();
  routeParamId = useRouteParameter<string | null>('id');
  queryParams = useRouteQueryParams<Record<string, string | undefined>>();
  queryParamQ = useRouteQueryParam<string | undefined>('q');
  routeData = useRouteData<Record<string, unknown>>();
  routeFragment = useRouteFragment();

  // Derived state
  isLargeScreen = computed(() => this.windowSize().width >= 1024);

  clockStore = useClock(1000);
  clock = computed(() => this.clockStore.now());
  clockTick = computed(() => this.clockStore.tick());

  // Effects
  // Keep URL query params in sync with demo state
  queryParamsSyncEffect = syncQueryParamsEffect({
    queryParams: computed(() => ({
      q: this.searchText() || undefined,
      counter: this.counter(),
    })),
  });

  // Persist search text to localStorage
  localStorageSyncEffect = syncLocalStorageEffect({
    signal: this.searchText,
    key: 'arp-demo-search',
  });

  // UI handlers
  onSearchInput(value: string) {
    this.searchText.set(value);
  }

  resetSearch() {
    this.searchText.set('');
  }

  incrementCounter() {
    this.counter.update((v) => v + 1);
  }

  forceBoxUpdate() {
    this.boxBounding().update();
  }
}
