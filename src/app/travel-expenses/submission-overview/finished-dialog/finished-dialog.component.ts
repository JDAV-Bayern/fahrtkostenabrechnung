import { Component, Inject } from '@angular/core';
import { DIALOG_DATA, DialogModule } from '@angular/cdk/dialog';

@Component({
  selector: 'app-finished-dialog',
  templateUrl: './finished-dialog.component.html',
  styleUrls: ['./finished-dialog.component.css'],
  standalone: true,
  imports: [DialogModule]
})
export class FinishedDialogComponent {
  private givenName: string;
  private courseCode: string;
  private courseName: string;

  constructor(
    @Inject(DIALOG_DATA)
    {
      courseName,
      courseCode,
      givenName
    }: {
      courseName: string;
      courseCode: string;
      givenName: string;
    }
  ) {
    this.givenName = givenName;
    this.courseCode = courseCode;
    this.courseName = courseName;
  }

  get emailHref(): string {
    const emailSubject = `Fahrtkostenabrechnung ${this.courseCode}`;
    const emailBody = `Hallo liebe Landesgeschäftsstelle,\n\nanbei meine Reisekostenabrechnung für den Kurs "${this.courseName}" (${this.courseCode}).\n\nVielen Dank und beste Grüße\n\n${this.givenName}`;
    return `mailto:lgs@jdav-bayern.de?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  }
}
