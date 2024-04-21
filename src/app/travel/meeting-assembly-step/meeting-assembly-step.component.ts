import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormCardComponent } from 'src/app/shared/form-card/form-card.component';
import { TravelControlService } from 'src/app/travel/shared/travel-control.service';

@Component({
  selector: 'app-meeting-assembly-step',
  templateUrl: './meeting-assembly-step.component.html',
  styleUrls: ['./meeting-assembly-step.component.css'],
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, FormCardComponent]
})
export class MeetingAssemblyStepComponent {
  form;

  constructor(public controlService: TravelControlService) {
    this.form = controlService.meetingStep;
    this.form.controls.type.setValue('assembly');
  }

  onSecondaryClick() {
    this.form.controls.name.setValue('');
  }
}
