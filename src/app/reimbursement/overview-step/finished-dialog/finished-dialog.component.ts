import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-finished-dialog',
  templateUrl: './finished-dialog.component.html',
  styleUrls: ['./finished-dialog.component.css'],
  standalone: true
})
export class FinishedDialogComponent {
  private readonly data = inject<{ subject: string; givenName: string }>(
    DIALOG_DATA
  );

  givenName = this.data.givenName;
  subject = this.data.subject;

  get emailHref(): string {
    const emailSubject = `Fahrtkostenabrechnung ${this.subject}`;
    const emailBody = `Hallo liebe Landesgeschäftsstelle,\n\nanbei meine Reisekostenabrechnung für die Veranstaltung "${this.subject}".\n\nVielen Dank und beste Grüße\n${this.givenName}`;
    return `mailto:lgs@jdav-bayern.de?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  }
}
