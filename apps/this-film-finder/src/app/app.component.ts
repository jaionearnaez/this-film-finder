import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  IonApp,
  IonButton,
  IonContent,
  IonRouterOutlet,
} from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import {
  selectShowFooter,
  selectShowHeader,
  selectUrl,
} from './selectors/router.selectors';

@Component({
  standalone: true,
  imports: [IonRouterOutlet, IonButton, IonApp, IonContent],
  selector: 'this-film-finder-root',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ion-app>
      <br />
      <p>app component works</p>
      @if(showHeader()){
      <p>header1 here</p>
      }
      <ion-content>
        <ion-router-outlet></ion-router-outlet>
      </ion-content>
      @if(showFooter()){
      <p>footer1 here</p>
      }
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
}
