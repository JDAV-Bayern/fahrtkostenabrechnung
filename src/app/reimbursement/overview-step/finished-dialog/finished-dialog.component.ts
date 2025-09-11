import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { Meeting } from 'src/domain/meeting.model';

@Component({
  selector: 'app-finished-dialog',
  templateUrl: './finished-dialog.component.html',
  styleUrls: ['./finished-dialog.component.css'],
})
export class FinishedDialogComponent {
  private readonly data = inject<{ meeting: Meeting; givenName: string }>(
    DIALOG_DATA,
  );

  givenName = this.data.givenName;
  meeting = this.data.meeting;

  get emailHref(): string {
    let subject;
    switch (this.meeting.type) {
      case 'committee':
        subject = this.meeting.name;
        break;
      case 'course':
        subject = this.meeting.code;
        break;
      case 'assembly':
        subject = 'Landesjugendversammlung';
        break;
    }
    const emailSubject = `Fahrtkostenabrechnung ${subject}`;
    const emailBody = `Hallo liebe Landesgeschäftsstelle,\n\nanbei meine Reisekostenabrechnung für die Veranstaltung "${subject}".\n\nVielen Dank und beste Grüße\n\n${this.givenName}`;
    return `mailto:lgs@jdav-bayern.de?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  }
}
