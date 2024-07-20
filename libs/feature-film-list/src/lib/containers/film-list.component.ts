import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonSpinner,
  IonTitle,
} from '@ionic/angular/standalone';
import { MovieCardComponent } from '../components/movie-card.component';
import { FilmsSignalStore } from '../store/films.signal-store';

@Component({
  selector: 'this-film-finder-film-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MovieCardComponent,
    IonContent,
    IonTitle,
    IonInput,
    IonButton,
    IonItem,
    IonSpinner,
  ],
  providers: [FilmsSignalStore],
  template: `
    <ion-content>
      <ion-title class="ion-padding">This films</ion-title>
      <form [formGroup]="filtersForm" (submit)="sendForm()" class="ion-padding">
        <div class="filter-input-wrapper">
          <ion-input
            formControlName="page"
            label="Page number"
            label-placement="floating"
            fill="outline"
            placeholder="Enter page number"
            clearInput="true"
            type="number"
          ></ion-input>
          <ion-input
            formControlName="limit"
            label="Number of films per page"
            label-placement="floating"
            fill="outline"
            placeholder="Enter number of films per page"
            type="number"
            clearInput="true"
          ></ion-input>

          <ion-input
            formControlName="search"
            label="Search in title"
            label-placement="floating"
            fill="outline"
            placeholder="Search in title"
            clearInput="true"
            type="string"
          ></ion-input>

          <ion-input
            formControlName="genre"
            label="Genre"
            label-placement="floating"
            fill="outline"
            placeholder="Enter genre"
            clearInput="true"
            type="string"
          ></ion-input>
        </div>
        <div class="actions-wrapper" class="ion-padding-top">
          <ion-button type="submit">Filter</ion-button>
        </div>
      </form>

      @if(status()==='loading'){
      <ion-item>
        <ion-spinner name="dots"></ion-spinner>
      </ion-item>
      } @else if(status()==='success'){ 
        @if(movies().length>0){
          <div class="movies-finder__cards-wrapper">
            @for (movie of movies(); track movie.id) {
              <this-film-finder-film-card [movie]="movie" />
            }
          </div>
        } @else {
          <p>No movies, try other filters</p>
        } 
      }@else if (status()==='error') {
        <p>An error has occurred. Please reload page</p>
      }
    </ion-content>
  `,
  styleUrl: './film-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilmListComponent {
  #filmListStore = inject(FilmsSignalStore);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  movies = this.#filmListStore.movies;
  status = this.#filmListStore.status;

  filtersForm = new FormGroup({
    page: new FormControl<number | null>(null),
    limit: new FormControl<number | null>(null),
    search: new FormControl<string | null>(''),
    genre: new FormControl<string | null>(''),
  });

  @Input() set page(value: number | null) {
    this.filtersForm.controls.page.setValue(value);
  }
  @Input() set limit(value: number | null) {
    this.filtersForm.controls.limit.setValue(value);
  }
  @Input() set search(value: string) {
    this.filtersForm.controls.search.setValue(value);
  }
  @Input() set genre(value: string) {
    this.filtersForm.controls.genre.setValue(value);
  }

  sendForm() {
    if (this.filtersForm.valid) {
      // console.log(this.limit);
      this.#filmListStore.loadMovies({
        page: this.filtersForm.controls.page.value ?? undefined,
        limit: this.filtersForm.controls.limit.value ?? undefined,
        search: this.filtersForm.controls.search.value ?? undefined,
        genre: this.filtersForm.controls.genre.value ?? undefined,
      });
    }
  }
}
