import { CdkStep, CdkStepper, CdkStepperModule } from '@angular/cdk/stepper';
import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  computed,
  contentChild,
  inject,
  signal,
  TemplateRef,
} from '@angular/core';
import { isFieldTree } from '@angular/forms/signals';
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

  // The selected step as a signal, so the validity of its control (a signal
  // forms field) can be read in computations and templates.
  private readonly selectedStep = signal<CdkStep | undefined>(undefined);

  readonly selectedStepInvalid = computed(() => {
    const control = this.selectedStep()?.stepControl;
    return isFieldTree(control) ? control().invalid() : false;
  });

  constructor() {
    super();

    // update route param when the selected step changes
    this.selectionChange.subscribe((event) => {
      this.navigateToStep(event.selectedStep);
      this.selectedStep.set(event.selectedStep);
    });
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
      this.selectedStep.set(this.selected);
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
      const isIncomplete = isFieldTree(control)
        ? control().invalid() || control().pending()
        : !step.completed;
      return isIncomplete && !step.optional && !step._completedOverride();
    }

    return false;
  }
}
