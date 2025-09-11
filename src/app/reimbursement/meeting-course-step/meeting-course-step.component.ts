import { Component, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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

  constructor() {
    this.code?.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(value => this.onCodeInput(value));
  }

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

  onCodeInput(value: string) {
    const upperCase = value.toUpperCase();
    if (value !== upperCase) {
      this.code?.setValue(upperCase);
    }

    if (value === 'LJV') {
      this.name?.setValue('Landesjugendversammlung');
    }
  }
}
