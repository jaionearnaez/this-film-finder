import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  Input,
  Signal,
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
import { FeaturePaginationComponent } from '@this-film-finder/feature-pagination/components/feature-pagination.component';
import { PaginationPipe } from '@this-film-finder/feature-pagination/pipes/pagination.pipe';
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
    FeaturePaginationComponent,
    PaginationPipe,
  ],
  providers: [FilmsSignalStore],
  template: `
    <ion-content>
      <ion-title class="ion-padding">This films</ion-title>
      <form
        [formGroup]="filtersForm"
        (submit)="sendFiltersForm()"
        class="ion-padding"
      >
        <div class="filter-input-wrapper">
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
        <div class="from-actions-wrapper ion-padding-top">
          <ion-button type="submit">Filter</ion-button>
          <ion-button (click)="clearAllFilters()">Clear all filters</ion-button>
        </div>
      </form>

      @if(status()==='loading'){
      <ion-item>
        <ion-spinner name="dots"></ion-spinner>
      </ion-item>
      } @else if(status()==='success'){ @if(movies().length>0){
      <div class="movies-finder__cards-wrapper">
        @for (movie of movies(); track movie.id) {
        <this-film-finder-film-card [movie]="movie" />
        }
      </div>
      <div>
        <this-film-finder-pagination
          [currentPage]="currentPage()"
          [totalPages]="numberOfPages() ?? 0"
          [limit]="currentLimit()"
          [pagesToShow]="
            {
              currentPage: currentPage(),
              totalNumberOfPages: numberOfPages() ?? 0
            } | pagination : 5 : 4
          "
          (goToPage)="setNewPage($event)"
          (changePageSize)="setNewLimit($event)"
        />
      </div>
      } @else {
      <p>No movies, try other filters</p>
      } }@else if (status()==='error') {
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
  numberOfPages = this.#filmListStore.numberOfPages;

  filtersForm = new FormGroup({
    search: new FormControl<string | null>(''),
    genre: new FormControl<string | null>(''),
  });

  page = input<number | undefined>();
  currentPage = computed(() => {
    return this.page() ?? 1;
  });
  limit = input<number | undefined>();
  currentLimit: Signal<number> = computed(() => {
    return this.limit() ?? 25;
  });

  @Input() set search(value: string) {
    this.filtersForm.controls.search.setValue(value);
  }
  @Input() set genre(value: string) {
    this.filtersForm.controls.genre.setValue(value);
  }

  sendFiltersForm() {
    if (this.filtersForm.valid) {
      this.#filmListStore.setNewFilters({
        search: this.filtersForm.controls.search.value ?? undefined,
        genre: this.filtersForm.controls.genre.value ?? undefined,
      });
    }
  }

  setNewPage(page: number) {
    this.#filmListStore.setNewPage({ page });
  }
  setNewLimit(limit: number) {
    this.#filmListStore.setNewLimit({ limit });
  }

  clearAllFilters(){
    this.#filmListStore.clearFilters()
  }
}
