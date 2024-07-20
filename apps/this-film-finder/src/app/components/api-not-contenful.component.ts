import { Component } from '@angular/core';
import { IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'this-film-finder-api-not-contenful',
  standalone: true,
  imports: [IonButton],
  template: `
    <img src="assets/broken-egg.svg" />
    <p>Ooops! we are not ready</p>
    <p>Please try again later</p>
    <!-- <ion-button (click)="location.back()">Try again</ion-button> -->
  `,
  styleUrl: './api-not-contenful.component.scss',
})
export class ApiNotContenfulComponent {
}
