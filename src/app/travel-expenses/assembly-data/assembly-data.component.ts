import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormCardComponent } from 'src/app/form-card/form-card.component';
import { ReimbursementControlService } from 'src/app/reimbursement-control.service';

@Component({
  selector: 'app-assembly-data',
  templateUrl: './assembly-data.component.html',
  styleUrls: ['./assembly-data.component.css'],
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, FormCardComponent]
})
export class AssemblyDataComponent {
  form;

  constructor(public controlService: ReimbursementControlService) {
    this.form = controlService.meetingStep;
    this.controlService.updateMeetingFormGroup('assembly');
  }

  onSecondarClick() {
    this.form.controls.name.setValue('');
  }
}
