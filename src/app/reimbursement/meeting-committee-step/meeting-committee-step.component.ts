import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormCardComponent } from 'src/app/shared/form-card/form-card.component';
import { ReimbursementControlService } from 'src/app/reimbursement/shared/reimbursement-control.service';
import {
  MatCalendarCellClassFunction,
  MatDatepickerModule
} from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TimeInputDirective } from 'src/app/shared/time-input.directive';

@Component({
  selector: 'app-meeting-committee-step',
  templateUrl: './meeting-committee-step.component.html',
  styleUrls: ['./meeting-committee-step.component.css'],
  imports: [
    RouterLink,
    ReactiveFormsModule,
    FormCardComponent,
    MatDatepickerModule,
    MatAutocompleteModule,
    TimeInputDirective
  ]
})
export class MeetingCommitteeStepComponent implements OnInit {
  private readonly controlService = inject(ReimbursementControlService);

  form = this.controlService.meetingStep;
  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    // Only highligh dates inside the month view.
    if (view === 'month') {
      const startDate = this.startDate.value;
      const endDate = this.endDate.value;
      const start = cellDate.getTime() === startDate?.getTime();
      const end = cellDate.getTime() === endDate?.getTime();

      if (start && end) {
        return 'single-date';
      }
      if (start) {
        return 'start-date';
      }
      if (end) {
        return 'end-date';
      }

      if (startDate && endDate) {
        if (
          cellDate.getTime() > startDate.getTime() &&
          cellDate.getTime() < endDate.getTime()
        ) {
          return 'range-date';
        }
      }
    }

    return '';
  };

  /* Changing the min and max values in the template will change the validation
   * state of the form after the component has been updated so we use filter
   * functions as a workaround
   */
  filterStartDates = (date: Date | null): boolean =>
    !date ||
    !this.endDate.value ||
    date?.getTime() <= this.endDate.value?.getTime();
  filterEndDates = (date: Date | null): boolean =>
    !date ||
    !this.startDate.value ||
    date?.getTime() >= this.startDate.value?.getTime();

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

  get now() {
    return new Date();
  }
}
