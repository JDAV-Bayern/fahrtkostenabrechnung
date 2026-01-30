import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RouterLink } from '@angular/router';
import { ReimbursementControlService } from 'src/app/reimbursement/shared/reimbursement-control.service';
import { FormDatetimeComponent } from 'src/app/shared/form-datetime/form-datetime.component';

@Component({
  selector: 'app-meeting-committee-step',
  templateUrl: './meeting-committee-step.component.html',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatAutocompleteModule,
    FormDatetimeComponent,
  ],
})
export class MeetingCommitteeStepComponent implements OnInit {
  private readonly controlService = inject(ReimbursementControlService);
  form = this.controlService.meetingStep;

  ngOnInit() {
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

  get start() {
    return this.time.controls.start;
  }

  get end() {
    return this.time.controls.end;
  }

  get overnight() {
    return this.controlService.foodSettings.controls.isOvernight;
  }

  get now() {
    return new Date();
  }
}
