import { CdkStep } from '@angular/cdk/stepper';
import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ReimbursementControlService } from 'src/app/reimbursement/shared/reimbursement-control.service';
import { PdfService } from 'src/app/shared/pdf-service';
import { ProgressIndicatorComponent } from 'src/app/shared/progress-indicator/progress-indicator.component';
import { Button } from 'src/app/shared/ui/button';
import { JdavStepper } from '../../shared/stepper/stepper';
import { CourseStep } from '../steps/course-step/course-step';
import { OverviewStep } from '../steps/overview-step/overview-step';
import { ParticipantStep } from '../steps/participant-step/participant-step';
import { TransportExpensesStep } from '../steps/transport-expenses-step/transport-expenses-step';

@Component({
  selector: 'jdav-course-form',
  imports: [
    Button,
    CdkStep,
    JdavStepper,
    ReactiveFormsModule,
    CourseStep,
    ParticipantStep,
    TransportExpensesStep,
    OverviewStep,
    ProgressIndicatorComponent,
  ],
  templateUrl: './course-form.html',
  host: { class: 'block h-full bg-gray-50' },
})
export class CourseForm {
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
