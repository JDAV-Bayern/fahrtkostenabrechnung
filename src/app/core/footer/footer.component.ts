import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'footer[app-footer]',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  imports: [RouterLink]
})
export class FooterComponent {}
