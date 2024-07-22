import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import {
  IonHeader,
  IonItem,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

@Component({
  selector: 'this-film-finder-header',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonItem, IonTitle],
  template: `
    <ion-header>
      <ion-toolbar color="none">
        @if(!!logo()){
        <ion-item
          title="Click to logout"
          aria-label="Click to logout"
          lines="none"
          color="none"
          (click)="logoClicked.emit()"
        >
          <img [src]="logo()" alt="Click to logout" />
          <ion-title>{{ title() }}</ion-title>
        </ion-item>
        }
      </ion-toolbar>
    </ion-header>
  `,
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThisFilmFinderHeaderComponent {
  logo = input.required<string | null>();
  title = input.required<string | null>();
  logoClicked = output<void>();
}
