import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgSelectConfig } from '@ng-select/ng-select';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'terf-jdav-by';

  constructor(
    private readonly titleService: Title,
    private selectConfig: NgSelectConfig
  ) {
    this.selectConfig.clearAllText = 'Eingabe löschen';
    this.selectConfig.notFoundText = 'Keine Ergebnisse gefunden';
  }

  ngOnInit() {
    this.titleService.setTitle('Fahtkostenabrechnung JDAV Bayern');
  }
}
