import { Component } from '@angular/core';

@Component({
  selector: 'jdav-badges',
  imports: [],
  templateUrl: './badges.html',
  styleUrl: './badges.css',
})
export class Badges {

  navisionStatus = 'Keine Datei hochgeladen';
  mvStatus = 'Keine Datei hochgeladen';
  kvStatus = 'Keine Datei hochgeladen';

  onKvManagerFileSelected(event: any) {
    this.kvStatus = 'Datei wird verarbeitet...';
    const file: File = event.target.files[0];
    if (file) {
      console.log(`Selected file: ${file.name}`);
      // Further processing can be done here
    }
  }

  onMvManagerFileSelected(event: any) {
    this.mvStatus = 'Datei wird verarbeitet...';
    const file: File = event.target.files[0];
    if (file) {
      console.log(`Selected file: ${file.name}`);
      // Further processing can be done here
    }
  }

  onNavisionFileSelected(event: any) {
    this.navisionStatus = 'Datei wird verarbeitet...';
    const file: File = event.target.files[0];
    if (file) {
      console.log(`Selected file: ${file.name}`);
      // Further processing can be done here
    }
  }
}
