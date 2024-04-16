import { Component, Inject } from '@angular/core';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Meeting } from 'src/domain/meeting';

@Component({
  selector: 'app-finished-dialog',
  templateUrl: './finished-dialog.component.html',
  styleUrls: ['./finished-dialog.component.css'],
  standalone: true
})
export class FinishedDialogComponent {
  private givenName: string;
  private meeting: Meeting;

  constructor(
    @Inject(DIALOG_DATA)
    data: {
      meeting: Meeting;
      givenName: string;
    }
  ) {
    this.givenName = data.givenName;
    this.meeting = data.meeting;
  }

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
