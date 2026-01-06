import { DialogModule } from '@angular/cdk/dialog';
import { CurrencyPipe, KeyValuePipe } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';
import { ReimbursementControlService } from 'src/app/reimbursement/shared/reimbursement-control.service';
import { ReimbursementValidatorService } from 'src/app/reimbursement/shared/reimbursement-validator.service';

import { ReactiveFormsModule } from '@angular/forms';
import { ExpenseTypePipe } from 'src/app/expenses/shared/expense-type.pipe';
import { Button } from 'src/app/shared/ui/button';
import { ReimbursementService } from '../../shared/reimbursement.service';

@Component({
  selector: 'jdav-overview-step',
  templateUrl: './overview-step.html',
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
export class OverviewStep {
  private readonly reimbursementService = inject(ReimbursementService);
  private readonly controlService = inject(ReimbursementControlService);
  private readonly validationService = inject(ReimbursementValidatorService);
  private readonly changeDetector = inject(ChangeDetectorRef);

  form = this.controlService.overviewStep;
  expenseForm = this.controlService.form.controls.expenses;

  readonly originalOrder = () => 0;

  get reimbursement() {
    return this.controlService.getReimbursement();
  }

  get meeting() {
    return this.reimbursement.meeting;
  }

  get participant() {
    return this.reimbursement.participant;
  }

  get report() {
    return this.reimbursementService.getReport(this.reimbursement);
  }

  getWarnings(): string[] {
    return this.validationService.validateReimbursement(this.reimbursement);
  }

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
