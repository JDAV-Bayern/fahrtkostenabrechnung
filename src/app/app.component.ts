import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgSelectConfig } from '@ng-select/ng-select';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent]
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
