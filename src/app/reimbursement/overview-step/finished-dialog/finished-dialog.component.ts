import { Component, Inject } from '@angular/core';
import { DIALOG_DATA } from '@angular/cdk/dialog';

@Component({
  selector: 'app-finished-dialog',
  templateUrl: './finished-dialog.component.html',
  styleUrls: ['./finished-dialog.component.css'],
  standalone: true
})
export class FinishedDialogComponent {
  private givenName: string;
  private subject: string;

  constructor(
    @Inject(DIALOG_DATA)
    data: {
      subject: string;
      givenName: string;
    }
  ) {
    this.givenName = data.givenName;
    this.subject = data.subject;
  }

  get emailHref(): string {
    const emailSubject = `Fahrtkostenabrechnung ${this.subject}`;
    const emailBody = `Hallo liebe Landesgeschäftsstelle,\n\nanbei meine Reisekostenabrechnung für die Veranstaltung "${this.subject}".\n\nVielen Dank und beste Grüße\n${this.givenName}`;
    return `mailto:lgs@jdav-bayern.de?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  }
}
