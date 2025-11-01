import { CdkStep } from '@angular/cdk/stepper';
import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ReimbursementControlService } from 'src/app/reimbursement/shared/reimbursement-control.service';
import { PdfService } from 'src/app/shared/pdf-service';
import { ProgressIndicatorComponent } from 'src/app/shared/progress-indicator/progress-indicator.component';
import { JdavStepper } from '../../shared/stepper/stepper';
import { ExpensesStepComponent } from '../expenses-step/expenses-step.component';
import { MeetingCourseStepComponent } from '../meeting-course-step/meeting-course-step.component';
import { OverviewStepComponent } from '../overview-step/overview-step.component';
import { ParticipantStepComponent } from '../participant-step/participant-step.component';

@Component({
  selector: 'app-course-steps',
  imports: [
    CdkStep,
    JdavStepper,
    ReactiveFormsModule,
    MeetingCourseStepComponent,
    ParticipantStepComponent,
    ExpensesStepComponent,
    OverviewStepComponent,
    ProgressIndicatorComponent,
  ],
  templateUrl: './course-steps.html',
  host: { class: 'block h-full bg-gray-50' },
})
export class CourseSteps {
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
