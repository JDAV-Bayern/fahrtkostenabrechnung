import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormCardComponent } from 'src/app/shared/form-card/form-card.component';
import { ReimbursementControlService } from 'src/app/reimbursement/shared/reimbursement-control.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TimeInputDirective } from 'src/app/shared/time-input.directive';

@Component({
  selector: 'app-meeting-committee-step',
  templateUrl: './meeting-committee-step.component.html',
  styleUrls: ['./meeting-committee-step.component.css'],
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    ReactiveFormsModule,
    FormCardComponent,
    MatDatepickerModule,
    MatAutocompleteModule,
    TimeInputDirective
  ]
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

  get time() {
    return this.form.controls.time;
  }

  get startDate() {
    return this.time.controls.startDate;
  }

  get startTime() {
    return this.time.controls.startTime;
  }

  get endDate() {
    return this.time.controls.endDate;
  }

  get endTime() {
    return this.time.controls.endTime;
  }
}
