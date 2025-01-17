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
  IonCheckbox,
  IonCol,
  IonContent,
  IonItem,
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
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonItem,
    IonRadioGroup,
    IonRadio,
    IonButton,
    IonCheckbox,
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
                  <ion-item>
                    <ion-radio-group formControlName="themeSelection">
                      <ion-radio
                        value="egg"
                        justify="start"
                        label-placement="end"
                        >Egg</ion-radio
                      >
                      <br />
                      <ion-radio
                        value="chicken"
                        justify="start"
                        label-placement="end"
                        >Chicken</ion-radio
                      ><br />
                    </ion-radio-group>
                  </ion-item>

                  <span
                    *ngxControlError="
                      loginForm.controls.themeSelection;
                      track: 'required'
                    "
                    class="error-message"
                  >
                    <p>Just guess...</p>
                  </span>
                  <ion-item lines="none">
                    <ion-checkbox
                      justify="start"
                      label-placement="end"
                      formControlName="rememberMe"
                      >Remember me</ion-checkbox
                    >
                  </ion-item>

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
    rememberMe: new FormControl<boolean>(false),
  });
  authError = this.#store.selectSignal(AuthFeatureState.selectAuthError);

  movies$: Observable<MoviesResponse | null> = of(null);

  sendForm() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid && this.loginForm.controls.themeSelection.value) {
      this.#store.dispatch(
        AuthActions.login({
          theme: this.loginForm.controls.themeSelection.value,
          rememberMe: this.loginForm.controls.rememberMe.value ?? false,
        })
      );
    }
  }
}
