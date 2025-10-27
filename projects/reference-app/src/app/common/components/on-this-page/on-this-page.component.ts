import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PageSection {
  id: string;
  title: string;
  element?: HTMLElement;
}

@Component({
  selector: 'on-this-page',
  styleUrls: ['./on-this-page.component.css'],
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="on-this-page">
      <h2 class="on-this-page__title">ON THIS PAGE</h2>
      <ul class="on-this-page__list">
        @for (section of sections(); track section.id) {
          <li class="on-this-page__item">
            <a 
              [href]="'#' + section.id" 
              class="on-this-page__link"
              [class.on-this-page__link--active]="activeSection() === section.id"
              (click)="scrollToSection($event, section.id)">
              {{ section.title }}
            </a>
          </li>
        }
      </ul>
      @if (sections().length > 0) {
        <button 
          class="on-this-page__back-to-top"
          (click)="scrollToTop($event)">
          ↑ Back to top
        </button>
      }
    </nav>
  `,
})
export class OnThisPageComponent {
  // Inputs as signals for declarative data flow
  sections = input<PageSection[]>([]);
  activeSection = input<string>('');

  scrollToSection(event: Event, sectionId: string) {
    event.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -20;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  scrollToTop(event: Event) {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
