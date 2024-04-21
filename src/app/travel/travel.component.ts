import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TravelControlService } from './shared/travel-control.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-travel',
  templateUrl: './travel.component.html',
  styleUrls: ['./travel.component.css'],
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule]
})
export class TravelExpensesComponent {
  form: FormGroup;

  constructor(private readonly controlService: TravelControlService) {
    this.form = this.controlService.form;
  }
}
