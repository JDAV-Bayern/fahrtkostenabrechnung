import { CdkStep, CdkStepper, CdkStepperModule } from '@angular/cdk/stepper';
import { NgTemplateOutlet } from '@angular/common';
import { Component, contentChild, inject, signal, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { merge, of, startWith, switchMap, map, takeUntil } from 'rxjs';
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

  /**
   * Tracks whether the current step's form control is invalid.
   * Used as a signal so that the template reacts to form status changes
   * in zoneless change detection mode, where reading `control.invalid`
   * directly does not establish a reactive dependency.
   */
  readonly isCurrentStepControlInvalid = signal(true);

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

    // Keep isCurrentStepControlInvalid in sync with the active step's form
    // control status. In Angular's zoneless change detection mode, reading
    // `control.invalid` in a template expression does not track the
    // underlying signal, so we bridge the gap via statusChanges here.
    this.selectionChange
      .pipe(
        startWith(null),
        switchMap((event) => {
          const step = event ? event.selectedStep : this.selected;
          const control = step?.stepControl;
          if (!control) return of(false);
          return merge(
            of(control.invalid),
            control.statusChanges.pipe(map((status) => status === 'INVALID')),
          );
        }),
        takeUntil(this._destroyed),
      )
      .subscribe((invalid) => this.isCurrentStepControlInvalid.set(invalid));
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
