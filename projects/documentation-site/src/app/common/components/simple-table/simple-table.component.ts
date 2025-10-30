import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'simple-table',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table class="simple-table">
      <thead>
        <tr>
          @for (column of columns(); track column) {
            <th>{{ column }}</th>
          }
        </tr>
      </thead>
      <tbody>
        @for (row of rows(); track $index) {
          <tr>
            @for (cell of row; track $index) {
              <td [innerHTML]="cell"></td>
            }
          </tr>
        }
      </tbody>
    </table>
  `,
  styleUrls: ['./simple-table.component.css'],
})
export class SimpleTableComponent {
  rows = input.required<string[][]>();
  columns = input.required<string[]>();
}
