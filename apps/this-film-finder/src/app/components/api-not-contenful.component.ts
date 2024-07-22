import { Component } from '@angular/core';

@Component({
  selector: 'this-film-finder-api-not-contenful',
  standalone: true,
  imports: [],
  template: `
    <img src="assets/broken-egg.svg" />
    <p>Ooops! we are not ready</p>
    <p>Please try again later</p>
  `,
  styleUrl: './api-not-contenful.component.scss',
})
export class ApiNotContenfulComponent {}
