import { CdkStep } from '@angular/cdk/stepper';
import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ReimbursementControlService } from 'src/app/reimbursement/shared/reimbursement-control.service';
import { PdfService } from 'src/app/shared/pdf-service';
import { ProgressIndicatorComponent } from 'src/app/shared/progress-indicator/progress-indicator.component';
import { Button } from 'src/app/shared/ui/button';
import { JdavStepper } from '../../shared/stepper/stepper';
import { ExpensesExtraStepComponent } from '../expenses-extra-step/expenses-extra-step.component';
import { ExpensesStepComponent } from '../expenses-step/expenses-step.component';
import { MeetingCommitteeStepComponent } from '../meeting-committee-step/meeting-committee-step.component';
import { OverviewStepComponent } from '../overview-step/overview-step.component';
import { ParticipantStepComponent } from '../participant-step/participant-step.component';

@Component({
  selector: 'app-committee-steps',
  imports: [
    Button,
    CdkStep,
    ReactiveFormsModule,
    JdavStepper,
    ParticipantStepComponent,
    ExpensesStepComponent,
    OverviewStepComponent,
    MeetingCommitteeStepComponent,
    ExpensesExtraStepComponent,
    ProgressIndicatorComponent,
  ],
  templateUrl: './committee-steps.html',
  host: { class: 'block h-full bg-gray-50' },
})
export class CommitteeSteps {
  private readonly controlService = inject(ReimbursementControlService);
  private readonly pdfService = inject(PdfService);

  form = this.controlService.form;
  isRenderingPdf = signal(false);

  async onSubmit() {
    this.isRenderingPdf.set(true);
    await this.pdfService.renderPdf();
    this.isRenderingPdf.set(false);
  }
}
