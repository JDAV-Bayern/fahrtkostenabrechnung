import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-card',
  templateUrl: './form-card.component.html',
  styleUrls: ['./form-card.component.css'],
  standalone: true
})
export class FormCardComponent {
  private readonly router = inject(Router);

  readonly nextStep = input<string>();
  readonly prevStep = input<string>();
  readonly nextDisabled = input(false);

  next() {
    if (this.nextStep() && !this.nextDisabled()) {
      this.router.navigate([this.nextStep()]);
    }
  }

  previous() {
    if (this.prevStep()) {
      this.router.navigate([this.prevStep()]);
    }
  }
}
