import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-card',
  templateUrl: './form-card.component.html',
  styleUrls: ['./form-card.component.css']
})
export class FormCardComponent {
  @Input() nextStep?: string;
  @Input() prevStep?: string;
  @Input() nextDisabled?: boolean = false;

  constructor(public router: Router) {}

  next() {
    if (this.nextStep && !this.nextDisabled) {
      this.router.navigate([this.nextStep]);
    }
  }

  previous() {
    if (this.prevStep) {
      this.router.navigate([this.prevStep]);
    }
  }
}
