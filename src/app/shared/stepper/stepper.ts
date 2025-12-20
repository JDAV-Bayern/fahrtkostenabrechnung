import { CdkStep, CdkStepper, CdkStepperModule } from '@angular/cdk/stepper';
import { NgTemplateOutlet } from '@angular/common';
import { Component, contentChild, inject, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from '../ui/button';

@Component({
  selector: 'jdav-stepper',
  templateUrl: './stepper.html',
  providers: [{ provide: CdkStepper, useExisting: JdavStepper }],
  imports: [Button, CdkStepperModule, NgTemplateOutlet],
})
export class JdavStepper extends CdkStepper {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly submitButton = contentChild<TemplateRef<unknown>>('submitButton');

  constructor() {
    super();

    // update route param when the selected step changes
    this.selectionChange.subscribe((event) =>
      this.navigateToStep(event.selectedStep),
    );
  }

  override ngAfterContentInit() {
    super.ngAfterContentInit();

    // update selected step when the route param changes
    this.route.params.subscribe((params) => {
      const selected = this.steps.find((step) => step.label === params['step']);

      if (!selected) {
        this.navigateToStep(this.steps.first);
        return;
      }

      for (const step of this.steps.toArray().slice(0, selected.index())) {
        // do not skip invalid steps
        if (this.anyControlsInvalidOrPending(step)) {
          this.navigateToStep(step);
          return;
        }

        // allow this step to be skipped for linear steppers
        step._markAsInteracted();
      }

      this.selectedIndex = selected.index();
    });
  }

  private navigateToStep(step: CdkStep) {
    this.router.navigate(['..', step.label], {
      relativeTo: this.route,
    });
  }

  private anyControlsInvalidOrPending(step: CdkStep): boolean {
    if (this.linear) {
      const control = step.stepControl;
      const isIncomplete = control
        ? control.invalid || control.pending
        : !step.completed;
      return isIncomplete && !step.optional && !step._completedOverride();
    }

    return false;
  }
}
