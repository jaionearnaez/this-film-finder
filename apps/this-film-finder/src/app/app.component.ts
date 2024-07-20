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
  AuthFeatureState,
} from '@this-film-finder/feature-auth/auth.state';
import { ThisFilmFinderHeaderComponent } from './components/header.component';
import {
  selectShowFooter,
  selectShowHeader,
  selectUrl,
} from './selectors/router.selectors';

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
      />
      }
      <ion-content>
        <ion-router-outlet></ion-router-outlet>
      </ion-content>
    </ion-app>
  `,
})
export class AppComponent {
  private readonly store = inject(Store);
  title = 'this-film-finder';

  currentUrl = this.store.selectSignal(selectUrl);
  // isLoggedIn = this.store.selectSignal(AuthFeatureState.selectIsLoggedIn);
  showHeader = this.store.selectSignal(selectShowHeader);
  showFooter = this.store.selectSignal(selectShowFooter);
  theme = this.store.selectSignal(AuthFeatureState.selectTheme);

  constructSrc(theme: AllowedThemes | null) {
    if (theme) {
      return `assets/${theme}.svg`;
    } else {
      return '';
    }
  }
}
