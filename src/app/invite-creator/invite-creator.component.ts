import { Component } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-invite-creator',
  templateUrl: './invite-creator.component.html',
  styleUrls: ['./invite-creator.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class InviteCreatorComponent {
  form;
  output;

  constructor(formBuilder: NonNullableFormBuilder) {
    this.form = formBuilder.group({
      courseCode: ['', Validators.required],
      courseName: ['', Validators.required]
    });
    this.output = formBuilder.control('');
    this.form.valueChanges.subscribe(value => this.createInvite(value));
  }

  createInvite(
    value: Partial<{
      courseCode: string | null;
      courseName: string | null;
      courseURL: string | null;
    }>
  ) {
    if (this.form.invalid) {
      this.output.setValue('');
      return;
    }
    const location = new URL(window.location.href);
    const courseCode = encodeURIComponent(value.courseCode || '');
    const courseName = encodeURIComponent(value.courseName || '');
    this.output.setValue(
      `${location.origin}/kurs?nummer=${courseCode}&name=${courseName}`
    );
  }

  onClickUrl(event: MouseEvent) {
    (event.target as HTMLInputElement).select();
  }

  copyURL() {
    navigator.clipboard.writeText(this.output.value);
  }
}
