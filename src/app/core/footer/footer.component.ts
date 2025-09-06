import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'footer[app-footer]',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  imports: [RouterLink]
})
export class FooterComponent {
  currentYearShort = new Date().getFullYear().toString().substring(2);
  schulungenUrl = 'https://jdav-bayern.de/schulungen' + this.currentYearShort;
}
