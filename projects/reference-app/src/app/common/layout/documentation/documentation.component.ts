import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  QueryList,
  signal,
  DestroyRef,
  inject,
} from '@angular/core';
import { DocumentationSectionComponent } from '../documentation-section/documentation-section.component';
import {
  OnThisPageComponent,
  PageSection,
} from '../../components/on-this-page/on-this-page.component';

@Component({
  selector: 'documentation',
  imports: [OnThisPageComponent],
  template: `
    <div class="documentation">
      <div class="documentation__header">
        <h1 class="documentation__heading">
          <ng-content select="[documentation-title]"></ng-content>
        </h1>
        <p class="documentation__description">
          <ng-content select="[documentation-description]"></ng-content>
        </p>
      </div>

      <div class="documentation__layout">
        <div class="documentation__content">
          <ng-content></ng-content>
        </div>
      </div>
    </div>

    <aside class="documentation__sidebar">
      <on-this-page [sections]="sections()" [activeSection]="activeSectionId()" />
    </aside>
  `,
  styleUrls: ['./documentation.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentationComponent implements AfterContentInit, AfterViewInit {
  @ContentChildren(DocumentationSectionComponent, { descendants: true })
  sectionComponents!: QueryList<DocumentationSectionComponent>;

  sections = signal<PageSection[]>([]);
  activeSectionId = signal<string>('');

  private destroyRef = inject(DestroyRef);
  private observer?: IntersectionObserver;

  ngAfterContentInit() {
    // Extract sections from content children
    this.updateSections();

    // Listen for changes to section components
    this.sectionComponents.changes.subscribe(() => {
      this.updateSections();
    });
  }

  ngAfterViewInit() {
    // Update sections again after view is initialized to ensure on-this-page component is available
    setTimeout(() => {
      this.updateSections();
    });
  }

  private updateSections() {
    const sections: PageSection[] = [];

    this.sectionComponents.forEach((component) => {
      const titleElement = component.elementRef.nativeElement.querySelector('[section-title]');
      const title = titleElement?.textContent?.trim() || '';

      if (title) {
        const id = this.slugify(title);

        // Set ID on the host element for anchor linking
        component.elementRef.nativeElement.setAttribute('id', id);

        sections.push({
          id,
          title,
          element: component.elementRef.nativeElement,
        });
      }
    });

    this.sections.set(sections);

    // Setup or refresh scroll spy with the latest sections
    this.setupScrollSpy();
  }

  private setupScrollSpy() {
    // Clean up existing observer
    if (this.observer) {
      this.observer.disconnect();
    }

    const sections = this.sections();
    if (sections.length === 0) return;

    // Setup intersection observer for scroll spy
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (id) {
              this.activeSectionId.set(id);
            }
          }
        });
      },
      {
        rootMargin: '-80px 0px -80% 0px',
        threshold: 0,
      },
    );

    // Observe all section elements
    sections.forEach((section) => {
      if (section.element) {
        this.observer!.observe(section.element);
      }
    });

    // Clean up on destroy
    this.destroyRef.onDestroy(() => {
      if (this.observer) {
        this.observer.disconnect();
      }
    });
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
