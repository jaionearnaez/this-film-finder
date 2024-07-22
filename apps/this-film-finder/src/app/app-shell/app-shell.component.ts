import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [],
  selector: 'this-film-finder-app-shell',
  styleUrl: './app-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <img src="assets/hen-chicken.svg" />
    <p>app-shell works!</p>
    <p>app-shell works!</p>
    <p>app-shell works!</p>
    <p>app-shell works!</p>
    <p>app-shell works!</p>
    <p>app-shell works!</p>
    <p>app-shell works!</p>
  `,
})
export class AppShellComponent {}
