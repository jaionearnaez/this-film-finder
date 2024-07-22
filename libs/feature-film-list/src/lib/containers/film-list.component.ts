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
  IonFooter,
  IonInput,
  IonItem,
  IonList,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonTitle,
} from '@ionic/angular/standalone';
import { FeaturePaginationComponent } from '@this-film-finder/feature-pagination/components/feature-pagination.component';
import { PaginationPipe } from '@this-film-finder/feature-pagination/pipes/pagination.pipe';
import { FilmCardComponent } from '../components/movie-card.component';
import { FilmsSignalStore } from '../store/films.signal-store';

@Component({
  selector: 'this-film-finder-film-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FilmCardComponent,
    FeaturePaginationComponent,
    PaginationPipe,
    IonContent,
    IonInput,
    IonTitle,
    IonList,
    IonSpinner,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonItem,
    IonFooter,
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
        <ion-list class="filter-input-wrapper">
          <ion-input
            formControlName="search"
            label="Search in title"
            label-placement="floating"
            fill="outline"
            placeholder="Search in title"
            clearInput="true"
            type="string"
          ></ion-input>
          @if(filterStatus()==='loading'){
          <ion-spinner name="dots"></ion-spinner>

          }@else if(filterStatus()==='success'){
          <ion-select
            formControlName="genre"
            label="Genre"
            label-placement="floating"
            interface="popover"
            fill="outline"
            placeholder="Select a genre"
            type="string"
          >
            @for(genre of genresForFiltering();track genre.id){
            <p>{{ genre.title }}({{ genre.count }})</p>

            <ion-select-option [value]="genre.title">{{
              genre.title
            }}</ion-select-option>
            }
          </ion-select>
          }@else if(filterStatus()==='error'){
          <ion-input
            formControlName="genre"
            label="Genre"
            label-placement="floating"
            fill="outline"
            placeholder="Enter genre"
            clearInput="true"
            type="string"
          ></ion-input>

          }
        </ion-list>

        <div class="from-actions-wrapper ion-padding-top">
          <ion-button type="submit">Filter</ion-button>
          <ion-button (click)="clearAllFilters()">Clear all filters</ion-button>
        </div>
      </form>

      @if(status()==='loading'){
      <ion-item>
        <ion-spinner name="dots"></ion-spinner>
      </ion-item>
      } @else if(status()==='success'){ @if(films().length>0){

      <div class="films-finder__cards-wrapper">
        @for (film of films(); track film.id) {
        <this-film-finder-film-card [film]="film" />
        }
      </div>
      } @else {
      <p>No movies, try other filters</p>
      } }@else if (status()==='error') {
      <p>An error has occurred. Please reload page</p>
      }
    </ion-content>
    <ion-footer>
      <div>
        <this-film-finder-pagination
          [currentPage]="currentPage()"
          [totalPages]="numberOfPages() ?? 0"
          [totalFilms]="numberOfFilms() ?? 0"
          [limit]="currentLimit()"
          [pagesToShow]="
            {
              currentPage: currentPage(),
              totalNumberOfPages: numberOfPages() ?? 0
            } | pagination : 2 : 2
          "
          (goToPage)="setNewPage($event)"
          (changePageSize)="setNewLimit($event)"
        />
      </div>
    </ion-footer>
  `,
  styleUrl: './film-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilmListComponent {
  #filmListStore = inject(FilmsSignalStore);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  films = this.#filmListStore.films;
  status = this.#filmListStore.status;
  numberOfPages = this.#filmListStore.numberOfPages;
  genresForFiltering = this.#filmListStore.genresForFiltering;
  numberOfFilms = this.#filmListStore.numberOfFilms;
  filterStatus = this.#filmListStore.filterStatus;

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

  clearAllFilters() {
    this.#filmListStore.clearFilters();
  }
}
