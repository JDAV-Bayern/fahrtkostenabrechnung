import { Component, inject, OnInit } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { ReimbursementFormService } from 'src/app/reimbursement/shared/reimbursement-form.service';
import { FormDatetimeComponent } from 'src/app/shared/form-datetime/form-datetime.component';

@Component({
  selector: 'app-meeting-committee-step',
  templateUrl: './meeting-committee-step.component.html',
  imports: [RouterLink, FormField, FormDatetimeComponent],
})
export class MeetingCommitteeStepComponent implements OnInit {
  private readonly formService = inject(ReimbursementFormService);

  form = this.formService.form.meeting;
  overnight = this.formService.foodSettingsForm.isOvernight;

  ngOnInit() {
    this.form.type().value.set('committee');
  }

  get now() {
    return new Date();
  }
}
