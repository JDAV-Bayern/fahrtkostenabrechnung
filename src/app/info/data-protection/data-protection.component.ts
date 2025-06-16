import { Component } from '@angular/core';

import { environment as importedEnv } from 'src/environments/environment';
import { version } from '../../../../package.json';
@Component({
  selector: 'app-data-protection',
  templateUrl: './data-protection.component.html',
  styleUrls: ['./data-protection.component.css']
})
export class DataProtectionComponent {
  version = version;
  environment = importedEnv.environment;
}
