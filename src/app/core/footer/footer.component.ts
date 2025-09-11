import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'footer[jdav-footer]',
  templateUrl: './footer.component.html',
  imports: [RouterLink],
  host: {
    class: 'bg-gray-800 text-gray-50',
  },
})
export class FooterComponent {
  currentYearShort = new Date().getFullYear().toString().substring(2);
  schulungenUrl = 'https://jdav-bayern.de/schulungen' + this.currentYearShort;
}
