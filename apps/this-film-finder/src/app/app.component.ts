import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  IonApp,
  IonButton,
  IonContent,
  IonRouterOutlet,
} from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import {
  AllowedThemes,
  AuthActions,
  AuthFeatureState,
} from '@this-film-finder/feature-auth/auth.state';
import { selectShowHeader } from '@this-film-finder/feature-router/selectors/router.selectors';
import { ThisFilmFinderHeaderComponent } from './components/header.component';

@Component({
  standalone: true,
  imports: [
    IonRouterOutlet,
    IonButton,
    IonApp,
    IonContent,
    ThisFilmFinderHeaderComponent,
  ],
  selector: 'this-film-finder-root',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ion-app>
      @if(showHeader()){
      <this-film-finder-header
        [logo]="constructSrc(theme())"
        [name]="theme()"
        (logoClicked)="logout()"
      />
      }
      <ion-content>
        <ion-router-outlet></ion-router-outlet>
      </ion-content>
    </ion-app>
  `,
})
export class AppComponent {
  #store = inject(Store);
  title = 'this-film-finder';

  showHeader = this.#store.selectSignal(selectShowHeader);
  theme = this.#store.selectSignal(AuthFeatureState.selectTheme);

  constructSrc(theme: AllowedThemes | null) {
    if (theme) {
      return `assets/${theme}.svg`;
    } else {
      return '';
    }
  }

  logout(){
    this.#store.dispatch(AuthActions.logout())
  }


}
