import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
} from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
  IonSpinner,
  ModalController,
} from '@ionic/angular/standalone';
import { FilmDetailSignalStore } from '../store/film-detail.signal-store';

@Component({
  selector: 'this-film-finder-film-detail',
  standalone: true,
  imports: [
    IonButtons,
    IonButton,
    IonIcon,
    IonItem,
    IonSpinner,
    IonCard,
    IonRow,
    IonCol,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonList,
    IonLabel,
  ],
  providers: [FilmDetailSignalStore],
  template: `
    <ion-buttons slot="end">
      <ion-button (click)="dismiss()" slot="end"
        ><ion-icon name="close"></ion-icon
      ></ion-button>
    </ion-buttons>

    @if(status()==='loading'){
    <ion-item>
      <ion-spinner name="dots"></ion-spinner>
    </ion-item>
    } @else if(status()==='success'){ @if(filmDetails()){
    <ion-card class="ion-padding">
      <ion-row>
        <ion-col class="ion-padding poster">
          @if(filmDetails()?.posterUrl){
          <img [src]="filmDetails()?.posterUrl" />
          }@else {
          <img src="assets/no-image.svg" />
          }
        </ion-col>
        <ion-col>
          <ion-card-content>
            <ion-card-header>
              <ion-card-title>
                {{ filmDetails()?.title }}
              </ion-card-title>
            </ion-card-header>
            <ion-list>
              <ion-item>
                <ion-label>
                  <h4>Summary</h4>
                  <p>{{ filmDetails()?.summary ?? '-' }}</p>
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-label>
                  <h4>Main Actors</h4>
                  <p>
                    {{
                      fromArrayToString({ array: filmDetails()?.mainActors })
                    }}
                  </p>
                </ion-label>
              </ion-item>

              <ion-item>
                <ion-label>
                  <h4>Writers:</h4>
                  <p>
                    {{ fromArrayToString({ array: filmDetails()?.writers }) }}
                  </p>
                </ion-label>
              </ion-item>

              <ion-item>
                <ion-label>
                  <h4>Directors:</h4>
                  <p>
                    {{ fromArrayToString({ array: filmDetails()?.directors }) }}
                  </p>
                </ion-label>
              </ion-item>

              <ion-item>
                <ion-label>
                  <h4>Genres:</h4>
                  <p>
                    {{ getGenreTitles(filmDetails()?.genres) }}
                  </p>
                </ion-label>
              </ion-item>
            </ion-list>
          </ion-card-content>
        </ion-col>
      </ion-row>
    </ion-card>
    } @else {
    <p>No details, try other movie</p>
    } }@else if (status()==='error') {
    <p>An error has occurred. Please reload page</p>
    }
  `,
  styleUrl: './film-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilmDetailComponent implements OnInit {
  modalController = inject(ModalController);
  #filmDetailStore = inject(FilmDetailSignalStore);
  filmId = input.required<string>();
  filmDetails = this.#filmDetailStore.film;
  status = this.#filmDetailStore.status;

  ngOnInit(): void {
    this.#filmDetailStore.loadMovie({ id: this.filmId() });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  getGenreTitles(
    genres: Array<{ title: string; id: string }> | undefined | null
  ): string {
    if (!genres || genres.length === 0) {
      return '-';
    }
    return this.fromArrayToString({ array: genres.map(({ title }) => title) });
  }

  fromArrayToString({
    array,
    joinCharacter = ', ',
  }: {
    array: Array<string> | undefined | null;
    joinCharacter?: string;
  }): string {
    if (!array || array.length === 0) {
      return '-';
    }
    return array.join(joinCharacter);
  }
}
