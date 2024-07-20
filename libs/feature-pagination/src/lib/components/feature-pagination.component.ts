import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'this-film-finder-pagination-feature-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `<p>feature-pagination works!</p>`,
  styleUrl: './feature-pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturePaginationComponent {}
