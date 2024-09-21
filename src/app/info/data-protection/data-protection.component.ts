import { Component } from '@angular/core';

import { version } from '../../../../package.json';
@Component({
  selector: 'app-data-protection',
  templateUrl: './data-protection.component.html',
  styleUrls: ['./data-protection.component.css'],
  standalone: true
})
export class DataProtectionComponent {
  version = version;
}
