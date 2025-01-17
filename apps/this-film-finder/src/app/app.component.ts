import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IonApp, IonContent, IonRouterOutlet } from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import {
  AllowedThemes,
  AuthActions,
  AuthFeatureState,
} from '@this-film-finder/feature-auth/auth.state';
import {
  selectShowHeader,
  selectTitle,
} from '@this-film-finder/feature-router/selectors/router.selectors';
import { ThisFilmFinderHeaderComponent } from './components/header.component';

@Component({
  standalone: true,
  imports: [IonRouterOutlet, IonApp, IonContent, ThisFilmFinderHeaderComponent],
  selector: 'this-film-finder-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ion-app>
      <ion-content>
        @if(showHeader()){
        <this-film-finder-header
          [logo]="constructSrc(theme())"
          [title]="title()"
          (logoClicked)="logout()"
        />
        }
        <ion-router-outlet></ion-router-outlet>
      </ion-content>
    </ion-app>
  `,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  #store = inject(Store);
  showHeader = this.#store.selectSignal(selectShowHeader);
  title = this.#store.selectSignal(selectTitle);
  theme = this.#store.selectSignal(AuthFeatureState.selectTheme);

  constructSrc(theme: AllowedThemes | null) {
    if (theme) {
      return `assets/${theme}.svg`;
    } else {
      return '';
    }
  }

  logout() {
    this.#store.dispatch(AuthActions.logout());
  }
}
