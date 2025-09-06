import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './core/footer/footer.component';
import { HeaderComponent } from './core/header/header.component';

@Component({
  selector: 'jdav-root',
  templateUrl: './app.component.html',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  host: {
    class:
      'grid grid-rows-[auto_1fr_auto] min-h-screen font-titillium text-gray-950 antialiased'
  }
})
export class AppComponent {}
