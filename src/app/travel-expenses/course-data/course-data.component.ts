import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormCardComponent } from 'src/app/form-card/form-card.component';
import { ReimbursementControlService } from 'src/app/reimbursement-control.service';

@Component({
  selector: 'app-course-data',
  templateUrl: './course-data.component.html',
  styleUrls: ['./course-data.component.css'],
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, FormCardComponent]
})
export class CourseDataComponent {
  form;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public controlService: ReimbursementControlService
  ) {
    this.form = controlService.meetingStep;
    this.controlService.updateMeetingFormGroup('course');

    const params = this.route.snapshot.queryParamMap;
    if (params.has('nummer') || params.has('name')) {
      this.form.patchValue({
        code: params.get('nummer') || '',
        name: params.get('name') || ''
      });
    }
  }

  get code() {
    return this.form.controls.code;
  }

  get name() {
    return this.form.controls.name;
  }
}
