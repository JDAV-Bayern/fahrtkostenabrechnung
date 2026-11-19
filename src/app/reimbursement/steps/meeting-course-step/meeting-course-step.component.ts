import { Component, effect, inject, OnInit, untracked } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { ActivatedRoute } from '@angular/router';
import { ReimbursementFormService } from 'src/app/reimbursement/shared/reimbursement-form.service';

@Component({
  selector: 'app-meeting-course-step',
  templateUrl: './meeting-course-step.component.html',
  imports: [FormField],
})
export class MeetingCourseStepComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly formService = inject(ReimbursementFormService);

  form = this.formService.form.meeting;

  constructor() {
    effect(() => {
      const code = this.form.code().value();
      untracked(() => this.onCodeInput(code));
    });
  }

  ngOnInit() {
    this.form.type().value.set('course');

    this.route.queryParamMap.subscribe((params) => {
      if (params.has('nummer') || params.has('name')) {
        this.form.code().value.set(params.get('nummer') || '');
        this.form.name().value.set(params.get('name') || '');
      }
    });
  }

  onCodeInput(value: string) {
    const upperCase = value.toUpperCase();
    if (value !== upperCase) {
      this.form.code().value.set(upperCase);
    }

    if (value === 'LJV') {
      this.form.name().value.set('Landesjugendversammlung');
    }
  }
}
