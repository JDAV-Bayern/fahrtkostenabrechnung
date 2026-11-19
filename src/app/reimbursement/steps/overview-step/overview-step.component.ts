import { DialogModule } from '@angular/cdk/dialog';
import { CurrencyPipe, KeyValuePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';
import { ReimbursementFormService } from 'src/app/reimbursement/shared/reimbursement-form.service';
import { ReimbursementValidatorService } from 'src/app/reimbursement/shared/reimbursement-validator.service';

import { Button } from 'src/app/shared/ui/button';
import { ExpenseTypePipe } from '../../expenses/shared/expense-type.pipe';

@Component({
  selector: 'app-overview-step',
  templateUrl: './overview-step.component.html',
  styleUrls: ['./overview-step.component.css'],
  imports: [
    Button,
    FormField,
    CurrencyPipe,
    KeyValuePipe,
    DialogModule,
    NgxFileDropModule,
    ExpenseTypePipe,
  ],
})
export class OverviewStepComponent {
  private readonly formService = inject(ReimbursementFormService);
  private readonly validationService = inject(ReimbursementValidatorService);

  readonly form = this.formService.form.overview;
  readonly files = this.formService.files;

  readonly originalOrder = () => 0;

  readonly reimbursement = this.formService.reimbursement;

  readonly meeting = computed(() => this.reimbursement().meeting);

  readonly participant = computed(() => this.reimbursement().participant);

  readonly report = this.formService.report;

  readonly foodEnabled = this.formService.foodEnabled;

  readonly warnings = computed(() =>
    this.validationService.validateReimbursement(this.reimbursement()),
  );

  fileDropped(files: NgxFileDropEntry[]) {
    for (const droppedFile of files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          this.files.update((files) => [...files, file]);
        });
      }
    }
  }

  removeFile(fileName: string) {
    this.files.update((files) => files.filter((f) => f.name !== fileName));
  }
}
