import { CdkStep } from '@angular/cdk/stepper';
import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ReimbursementControlService } from 'src/app/reimbursement/shared/reimbursement-control.service';
import { PdfService } from 'src/app/shared/pdf-service';
import { ProgressIndicatorComponent } from 'src/app/shared/progress-indicator/progress-indicator.component';
import { Button } from 'src/app/shared/ui/button';
import { JdavStepper } from '../../shared/stepper/stepper';
import { CommitteeStep } from '../steps/committee-step/committee-step';
import { FoodExpensesStep } from '../steps/food-expenses-step/food-expenses-step';
import { OtherExpensesStep } from '../steps/other-expenses-step/other-expenses-step';
import { OverviewStep } from '../steps/overview-step/overview-step';
import { ParticipantStep } from '../steps/participant-step/participant-step';
import { TransportExpensesStep } from '../steps/transport-expenses-step/transport-expenses-step';

@Component({
  selector: 'jdav-committee-form',
  imports: [
    Button,
    CdkStep,
    ReactiveFormsModule,
    JdavStepper,
    ParticipantStep,
    TransportExpensesStep,
    OverviewStep,
    CommitteeStep,
    OtherExpensesStep,
    ProgressIndicatorComponent,
    FoodExpensesStep,
  ],
  templateUrl: './committee-form.html',
  host: { class: 'block h-full bg-gray-50' },
})
export class CommitteeForm {
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
