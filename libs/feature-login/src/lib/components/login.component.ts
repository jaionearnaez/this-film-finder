import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonRadio,
  IonRadioGroup,
  IonRow,
} from '@ionic/angular/standalone';
import { MoviesResponse } from '@movies-data-access/validator/validators';
import { Store } from '@ngrx/store';
import {
  AllowedThemes,
  AuthActions,
  AuthFeatureState,
} from '@this-film-finder/feature-auth/auth.state';
import { NgxControlError } from 'ngxtension/control-error';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'this-film-finder-login-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgxControlError,
    IonContent,
    IonCard,
    IonRow,
    IonCol,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCardContent,
    IonRadioGroup,
    IonRadio,
    IonButton,
  ],
  template: `
    <ion-content>
      <div class="card-container">
        <ion-card>
          <ion-row>
            <ion-col class="ion-padding">
              <ion-card-header>
                <ion-card-title>
                  I ordered a chicken and an egg from Amazon.
                </ion-card-title>
                <ion-card-subtitle
                  >Which one do you think will be first?</ion-card-subtitle
                >
              </ion-card-header>

              <ion-card-content>
                <form [formGroup]="loginForm" (submit)="sendForm()">
                  <ion-radio-group formControlName="themeSelection">
                    <ion-radio value="egg" label-placement="end">Egg</ion-radio>
                    <br />
                    <ion-radio value="chicken" label-placement="end"
                      >Chicken</ion-radio
                    ><br />
                  </ion-radio-group>

                  <span
                    *ngxControlError="
                      loginForm.controls.themeSelection;
                      track: 'required'
                    "
                    class="error-message"
                  >
                    <p>Just guess...</p>
                  </span>

                  @if (this.authError().isError) {
                  <span class="error-message">
                    <p>
                      {{ this.authError().errorMessage }}
                    </p>
                  </span>
                  }

                  <div class="actions-wrapper ion-padding">
                    <ion-button type="submit"
                      >Select theme & continue</ion-button
                    >
                  </div>
                </form>
              </ion-card-content>
            </ion-col>
          </ion-row>
        </ion-card>
      </div>
    </ion-content>
  `,

  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  #store = inject(Store);
  loginForm = new FormGroup({
    themeSelection: new FormControl<AllowedThemes | null>(null, [
      Validators.required,
    ]),
  });
  authError = this.#store.selectSignal(AuthFeatureState.selectAuthError);

  movies$: Observable<MoviesResponse | null> = of(null);

  sendForm() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      this.#store.dispatch(AuthActions.getToken());
      if (this.loginForm.controls.themeSelection.value) {
        this.#store.dispatch(
          AuthActions.setTheme({
            theme: this.loginForm.controls.themeSelection.value,
          })
        );
      }
    }
    console.log('do something else');
  }
}
