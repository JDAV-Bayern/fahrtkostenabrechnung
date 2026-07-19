import { CdkStep, CdkStepper, CdkStepperModule } from '@angular/cdk/stepper';
import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  contentChild,
  inject,
  signal,
  TemplateRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
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

  // Signal mirror of the selected step's control validity. The app runs
  // zoneless, so programmatic form changes (e.g. disabling controls in a
  // valueChanges subscription) don't trigger change detection. Reading the
  // validity through a signal that follows the control's statusChanges keeps
  // the Weiter/submit button's disabled state in sync.
  readonly selectedStepInvalid = signal(false);
  private stepStatusSub?: Subscription;

  constructor() {
    super();

    // update route param when the selected step changes
    this.selectionChange.subscribe((event) => {
      this.navigateToStep(event.selectedStep);
      this.watchSelectedStep(event.selectedStep);
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
      this.watchSelectedStep(this.selected);
    });
  }

  // Track the selected step's control validity in a signal so the button's
  // disabled binding updates under zoneless change detection.
  private watchSelectedStep(step: CdkStep | undefined) {
    this.stepStatusSub?.unsubscribe();

    const control = step?.stepControl;
    this.selectedStepInvalid.set(control?.invalid ?? false);

    this.stepStatusSub = control?.statusChanges.subscribe(() =>
      this.selectedStepInvalid.set(control.invalid),
    );
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
