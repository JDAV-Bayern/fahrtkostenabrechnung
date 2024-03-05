import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-finished-dialog',
  templateUrl: './finished-dialog.component.html',
  styleUrls: ['./finished-dialog.component.css']
})
export class FinishedDialogComponent {
  private givenName: string;
  private courseCode: string;
  private courseName: string;

  constructor(
    @Inject(MAT_DIALOG_DATA)
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
