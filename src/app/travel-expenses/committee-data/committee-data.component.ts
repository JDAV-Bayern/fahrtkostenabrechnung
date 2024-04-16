import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  OwlDateTimeModule,
  OwlNativeDateTimeModule
} from '@danielmoncada/angular-datetime-picker';
import { FormCardComponent } from 'src/app/form-card/form-card.component';
import { ReimbursementControlService } from 'src/app/reimbursement-control.service';

@Component({
  selector: 'app-committee-data',
  templateUrl: './committee-data.component.html',
  styleUrls: ['./committee-data.component.css'],
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    ReactiveFormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    FormCardComponent
  ]
})
export class CommitteeDataComponent {
  form;

  constructor(public controlService: ReimbursementControlService) {
    this.form = controlService.meetingStep;
    this.controlService.updateMeetingFormGroup('committee');
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
