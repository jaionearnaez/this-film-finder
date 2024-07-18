import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonButton,
  IonInput,
  IonRadio,
  IonRadioGroup,
} from '@ionic/angular/standalone';
import { MoviesResponse } from '@movies-data-access/validator/validators';
import { Store } from '@ngrx/store';
import {
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
    IonButton,
    IonInput,
    IonRadioGroup,
    IonRadio,
    AsyncPipe,
    NgxControlError,
  ],
  template: ` <p>
      I ordered a chicken and an egg from Amazon. Which one do you think will be
      first?
    </p>

    <form [formGroup]="loginForm" (submit)="sendForm()">
      <ion-radio-group formControlName="themeSelection">
        <ion-radio value="egg" label-placement="end">Egg</ion-radio> <br />
        <ion-radio value="chicken" label-placement="end">Chicken</ion-radio
        ><br />
      </ion-radio-group>

      <span
        *ngxControlError="loginForm.controls.themeSelection; track: 'required'"
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

      <div class="actions-wrapper">
        <ion-button type="submit">Select theme & continue</ion-button>
      </div>
    </form>`,

  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  #store = inject(Store);
  loginForm = new FormGroup({
    themeSelection: new FormControl('', [Validators.required]),
  });
  authError = this.#store.selectSignal(AuthFeatureState.selectAuthError);

  movies$: Observable<MoviesResponse | null> = of(null);

  sendForm() {
    this.loginForm.markAllAsTouched();
      this.#store.dispatch(AuthActions.getToken());
      console.log('do something else');
  }
}
