import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  IonButton,
  IonContent,
  IonIcon,
  ModalController,
} from '@ionic/angular/standalone';

@Component({
  selector: 'this-film-finder-film-detail',
  standalone: true,
  imports: [IonIcon, IonButton, IonContent],
  template: `<ion-button class="button--close" fill="clear" (click)="dismiss()">
      <ion-icon name="close"></ion-icon
    ></ion-button>
    <p>film-detail works!</p> `,
  styleUrl: './film-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilmDetailComponent {
  modalController = inject(ModalController);

  dismiss() {
    this.modalController.dismiss();
  }
}
