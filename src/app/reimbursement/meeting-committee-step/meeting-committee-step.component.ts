import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  OwlDateTimeIntl,
  OwlDateTimeModule
} from '@danielmoncada/angular-datetime-picker';
import { FormCardComponent } from 'src/app/shared/form-card/form-card.component';
import { ReimbursementControlService } from 'src/app/reimbursement/shared/reimbursement-control.service';
import { JdavDateTimeIntl } from 'src/app/core/date-time-intl';

@Component({
  selector: 'app-meeting-committee-step',
  templateUrl: './meeting-committee-step.component.html',
  styleUrls: ['./meeting-committee-step.component.css'],
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    ReactiveFormsModule,
    OwlDateTimeModule,
    FormCardComponent
  ],
  // cannot be provided in app config as it will be overwritten by the module import
  providers: [{ provide: OwlDateTimeIntl, useClass: JdavDateTimeIntl }]
})
export class MeetingCommitteeStepComponent {
  form;

  constructor(public controlService: ReimbursementControlService) {
    this.form = controlService.meetingStep;
    this.form.controls.type.setValue('committee');
  }

  get name() {
    return this.form.controls.name;
  }

  get location() {
    return this.form.controls.location;
  }

  get period() {
    return this.form.controls.period;
  }
}
