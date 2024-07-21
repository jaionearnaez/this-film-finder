import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPopover,
  IonRow,
  IonSkeletonText,
} from '@ionic/angular/standalone';
import { Movie } from '@movies-data-access/validator/validators';
import { FilmDetailComponent } from '../containers/film-detail.component';

@Component({
  selector: 'this-film-finder-film-card',
  standalone: true,
  imports: [
    FilmDetailComponent,
    IonCard,
    IonLabel,
    IonCardContent,
    IonCardTitle,
    IonButton,
    IonIcon,
    IonPopover,
    IonContent,
    IonList,
    IonItem,
    IonSkeletonText,
    IonModal,
    DatePipe,
    IonRow,
    IonCol,
    IonCardHeader,
  ],
  template: `
    <div class="card-container ion-padding">
      <ion-card [id]="'open-modal-' + film().id">
        <ion-row>
          <ion-col class="ion-padding">
            <ion-card-header>
              <ion-card-title>{{ film().title }} </ion-card-title>
            </ion-card-header>
            <ion-card-content>
              @defer (on viewport) { @if(film().posterUrl){
              <img [src]="film().posterUrl" />
              }@else {
              <img src="assets/no-image.svg" />
              }
              <ion-modal
                #movieModal
                class="modal--movie"
                [trigger]="'open-modal-' + film().id"
              >
                <ng-template>
                  <this-film-finder-film-detail [filmId]="film().id" />
                </ng-template>
              </ion-modal>
              } @placeholder {
              <ion-skeleton-text
                [animated]="true"
                style="width: 100%; height:100%;"
              ></ion-skeleton-text>
              }
            </ion-card-content>
          </ion-col>
        </ion-row>
      </ion-card>
    </div>
  `,
  styleUrl: './movie-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilmCardComponent {
  film = input.required<Movie>();
}
