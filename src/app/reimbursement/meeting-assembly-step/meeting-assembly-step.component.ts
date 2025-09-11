import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ReimbursementControlService } from 'src/app/reimbursement/shared/reimbursement-control.service';
import { FormCardComponent } from 'src/app/shared/form-card/form-card.component';

@Component({
  selector: 'app-meeting-assembly-step',
  templateUrl: './meeting-assembly-step.component.html',
  styleUrls: ['./meeting-assembly-step.component.css'],
  imports: [RouterLink, ReactiveFormsModule, FormCardComponent],
})
export class MeetingAssemblyStepComponent implements OnInit {
  private readonly controlService = inject(ReimbursementControlService);

  form = this.controlService.meetingStep;

  ngOnInit() {
    this.form.controls.type.setValue('assembly');
  }

  onSecondaryClick() {
    this.form.controls.name.setValue('');
  }
}
