import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonButton, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  standalone: true,
  imports: [IonRouterOutlet, IonButton],
  selector: 'this-film-finder-root',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <ion-router-outlet></ion-router-outlet>
    <ion-button (click)="showAlert()">it works!</ion-button>`,
})
export class AppComponent {
  title = 'this-film-finder';
  showAlert(){
    alert('it works!')
  }
}
