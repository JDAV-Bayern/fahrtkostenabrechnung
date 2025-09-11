import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ReimbursementControlService } from 'src/app/reimbursement/shared/reimbursement-control.service';
import { FormCardComponent } from 'src/app/shared/form-card/form-card.component';

@Component({
  selector: 'app-meeting-course-step',
  templateUrl: './meeting-course-step.component.html',
  imports: [ReactiveFormsModule, FormCardComponent],
})
export class MeetingCourseStepComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly controlService = inject(ReimbursementControlService);

  form = this.controlService.meetingStep;

  ngOnInit() {
    this.form.controls.type.setValue('course');

    this.route.queryParamMap.subscribe((params) => {
      if (params.has('nummer') || params.has('name')) {
        this.form.patchValue({
          code: params.get('nummer') || '',
          name: params.get('name') || '',
        });
      }
    });
  }

  get code() {
    return this.form.controls.code;
  }

  get name() {
    return this.form.controls.name;
  }
}
