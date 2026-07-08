import { DialogModule } from '@angular/cdk/dialog';
import { CurrencyPipe, KeyValuePipe } from '@angular/common';
import { ChangeDetectorRef, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';
import { ReimbursementControlService } from 'src/app/reimbursement/shared/reimbursement-control.service';
import { ReimbursementValidatorService } from 'src/app/reimbursement/shared/reimbursement-validator.service';

import { ReactiveFormsModule } from '@angular/forms';
import { Button } from 'src/app/shared/ui/button';
import { ExpenseTypePipe } from '../../expenses/shared/expense-type.pipe';
import { ReimbursementService } from '../../shared/reimbursement.service';

@Component({
  selector: 'app-overview-step',
  templateUrl: './overview-step.component.html',
  styleUrls: ['./overview-step.component.css'],
  imports: [
    Button,
    ReactiveFormsModule,
    CurrencyPipe,
    KeyValuePipe,
    DialogModule,
    NgxFileDropModule,
    ExpenseTypePipe,
  ],
})
export class OverviewStepComponent {
  private readonly reimbursementService = inject(ReimbursementService);
  private readonly controlService = inject(ReimbursementControlService);
  private readonly validationService = inject(ReimbursementValidatorService);
  private readonly changeDetector = inject(ChangeDetectorRef);

  form = this.controlService.overviewStep;

  readonly originalOrder = () => 0;

  // The whole reimbursement form is built on other steps and this component is
  // rendered eagerly by the stepper. Under zoneless change detection, plain
  // getters reading the form would only be evaluated once (while the form is
  // still empty), so the summary must derive from a signal that follows the
  // form's value changes.
  private readonly formValue = toSignal(this.controlService.form.valueChanges, {
    initialValue: null,
  });

  readonly reimbursement = computed(() => {
    this.formValue();
    return this.controlService.getReimbursement();
  });

  readonly meeting = computed(() => this.reimbursement().meeting);

  readonly participant = computed(() => this.reimbursement().participant);

  readonly report = computed(() =>
    this.reimbursementService.getReport(this.reimbursement()),
  );

  readonly warnings = computed(() =>
    this.validationService.validateReimbursement(this.reimbursement()),
  );

  fileDropped(files: NgxFileDropEntry[]) {
    for (const droppedFile of files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        const files = this.form.controls.files;
        fileEntry.file((file: File) => {
          files.setValue([...files.value, file]);
          this.changeDetector.markForCheck();
        });
      }
    }
  }

  removeFile(fileName: string) {
    const files = this.form.controls.files;
    files.setValue(files.value.filter((f) => f.name !== fileName));
  }
}
