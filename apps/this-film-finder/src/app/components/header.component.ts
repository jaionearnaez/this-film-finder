import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonHeader, IonItem, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'this-film-finder-header',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonItem, RouterLink],
  template: `
    <ion-header>
      <ion-toolbar color="none" >
        @if(!!logo()){
        <ion-item lines="none" color="none" (click)="logoClicked.emit()">
          <img
            [src]="logo()"
          />
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
  name = input.required<string | null>();
  logoClicked = output<void>()
}
