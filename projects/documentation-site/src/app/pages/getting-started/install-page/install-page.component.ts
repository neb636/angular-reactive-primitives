import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CodeBlockComponent } from '../../../common/components/code-block/code-block.component';
import { DocumentationSectionComponent } from '../../../common/layout/documentation-section/documentation-section.component';
import { DocumentationComponent } from '../../../common/layout/documentation/documentation.component';
import { OnThisPageComponent } from '../../../common/components/on-this-page/on-this-page.component';

@Component({
  selector: 'install-page',
  imports: [
    CodeBlockComponent,
    DocumentationSectionComponent,
    DocumentationComponent,
    OnThisPageComponent,
  ],
  template: `
    <documentation>
      <ng-container documentation-title>Installation</ng-container>
      <ng-container documentation-description>
        Learn how to install and set up Angular Reactive Primitives in your
        Angular project.
      </ng-container>

      <documentation-section id="installation">
        <ng-container section-title>Installation</ng-container>
        <p>Install the package using your preferred package manager:</p>

        <code-block
          title="Install Package"
          [code]="'npm install @angular/reactive-primitives'"
        />
      </documentation-section>

      <documentation-section id="basic-usage">
        <ng-container section-title>Basic Usage</ng-container>
        <p>Import and use the utilities in your components:</p>
        <code-block title="Basic Usage" [code]="basicUsageCode" />
      </documentation-section>

      <documentation-section id="requirements">
        <ng-container section-title>Requirements</ng-container>
        <ul>
          <li>Angular 17+ (with signals support)</li>
          <li>TypeScript 5.0+</li>
          <li>Node.js 18+</li>
        </ul>
      </documentation-section>

      <ng-container sidebar-right>
        <on-this-page [sections]="sections" />
      </ng-container>
    </documentation>
  `,
  styleUrls: ['./install-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstallPageComponent {
  sections = [
    {
      id: 'installation',
      title: 'Installation',
    },
    {
      id: 'basic-usage',
      title: 'Basic Usage',
    },
    {
      id: 'requirements',
      title: 'Requirements',
    },
  ];
  basicUsageCode = `import { Component, signal } from '@angular/core';
import { useDebouncedSignal } from '@angular/reactive-primitives';

@Component({
  selector: 'example',
  template: \`
    <input [(ngModel)]="searchInput" />
    <p>Debounced: {{ debouncedSearch() }}</p>
  \`
})
export class ExampleComponent {
  searchInput = signal('');
  debouncedSearch = useDebouncedSignal(this.searchInput, 300);
}`;
}
