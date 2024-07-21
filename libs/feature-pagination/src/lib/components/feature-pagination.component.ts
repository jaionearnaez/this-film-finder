import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import {
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';

@Component({
  selector: 'this-film-finder-pagination',
  standalone: true,
  imports: [IonButton, IonIcon, IonItem, IonLabel, IonInput],
  template: `
    @if (currentPage() &&totalPages()) {
    <div class="pagination">
      <div class="paginationButtons">
        <ion-button
          fill="clear"
          (click)="doGoToPage(currentPage(), -1)"
          [disabled]="parseToNumber(currentPage()) <= 1"
        >
          <ion-icon name="chevron-back-outline"></ion-icon>
        </ion-button>
        @for (eachPageNumber of pagesToShow(); track $index) { @if ( $index > 0
        && pagesToShow()[$index] - pagesToShow()[$index - 1] > 1 ) {
        <ion-button class="full-color" disabled fill="clear">...</ion-button>
        }
        <ion-button
          class="full-color"
          (click)="goToPage.emit(eachPageNumber)"
          fill="clear"
          [style.border]="
          parseToNumber(currentPage()) === eachPageNumber
              ? '2px var(--ion-color-secondary) solid'
              : ''
          "
          [disabled]="parseToNumber(currentPage()) === eachPageNumber"
          >{{ eachPageNumber }}</ion-button
        >
        }

        <ion-button
          [disabled]="parseToNumber(currentPage()) >= totalPages()"
          fill="clear"
          (click)="doGoToPage(currentPage(), +1)"
        >
          <ion-icon name="chevron-forward-outline"></ion-icon>
        </ion-button>
      </div>
      <div class="paginationGoto">
      <ion-item lines="none" [style.border-right]="'1px #D1CBCF solid'">
          <ion-label>
            <h3>Page Count</h3>
            <p>{{ totalPages() }}</p></ion-label
          >
        </ion-item>
        <ion-item lines="none">
          <ion-label>
            <h3>Total Videos</h3>
            <p>{{ totalFilms() }}</p></ion-label
          >
        </ion-item>
        <ion-item lines="none">
          <ion-input
            class="goToPage"
            fill="solid"
            labelPlacement="stacked"
            label="Go to page"
            type="number"
            #gotoPageNumber
            (keyup.enter)="doGoToPage(gotoPageNumber.value ?? 1)"
            [value]="parseToNumber(currentPage())"
            enterkeyhint="go"
          >
          </ion-input>
        </ion-item>

        <ion-item lines="none">
          <ion-input
            class="setPageSize"
            fill="solid"
            labelPlacement="stacked"
            label="Films per page"
            inputmode="numeric"
            #setPageSizeNumber
            (keyup.enter)="doChangePageSize(setPageSizeNumber.value ?? 25)"
            [value]="limit()"
            enterkeyhint="go"
          ></ion-input>
        </ion-item>
      </div>
    </div>
    }
  `,
  styleUrl: './feature-pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturePaginationComponent {
  console = console;
  currentPage = input.required<number>();
  totalPages = input.required<number>();
  limit = input.required<number>();
  totalFilms = input.required<number>();

  pagesToShow = input<Array<number>>([]);

  readonly goToPage = output<number>();
  readonly changePageSize = output<number>();

  doGoToPage(_pageNumber: number | string, diff?: number) {
    const pageNumber: number =
      typeof _pageNumber === 'number' ? _pageNumber : Number(_pageNumber);

    if (pageNumber) {
      this.goToPage.emit(pageNumber + (diff ? diff : 0));
    }
  }

  doChangePageSize(_pageSize: number | string) {
    const pageSize: number =
      typeof _pageSize === 'number' ? _pageSize : Number(_pageSize);

    if (pageSize) {
      this.changePageSize.emit(pageSize);
    }
  }

  parseToNumber(value: string | number): number {
    return typeof value === 'number' ? value : Number(value);
  }
}
