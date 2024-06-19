import { Routes } from '@angular/router';
import { ParticipantStepComponent } from './reimbursement/participant-step/participant-step.component';
import { OverviewStepComponent } from './reimbursement/overview-step/overview-step.component';
import { ExpensesStepComponent } from './reimbursement/expenses-step/expenses-step.component';
import { DataProtectionComponent } from './info/data-protection/data-protection.component';
import { InfoComponent } from './info/info.component';
import { ReimbursementComponent } from './reimbursement/reimbursement.component';
import { MeetingCourseStepComponent } from './reimbursement/meeting-course-step/meeting-course-step.component';
import {
  meetingGuard,
  transportExpensesGuard,
  participantGuard,
  expensesGuard
} from './reimbursement/shared/finished-step.guard';
import { MeetingAssemblyStepComponent } from './reimbursement/meeting-assembly-step/meeting-assembly-step.component';
import { MeetingCommitteeStepComponent } from './reimbursement/meeting-committee-step/meeting-committee-step.component';
import { ExpensesExtraStepComponent } from './reimbursement/expenses-extra-step/expenses-extra-step.component';
import { ExpenseRatesComponent } from './info/expense-rates/expense-rates.component';
import { disabledStepGuard } from './reimbursement/shared/disabled-step.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'kurs',
    pathMatch: 'full'
  },
  {
    path: '',
    component: InfoComponent,
    data: { breadcrumb: 'Start' },
    children: [
      {
        path: 'datenschutz',
        title: 'Datenschutzerklärung',
        component: DataProtectionComponent,
        data: { breadcrumb: 'Datenschutzerklärung' }
      },
      {
        path: 'erstattungssaetze',
        title: 'Erstattungssätze',
        component: ExpenseRatesComponent,
        data: { breadcrumb: 'Erstattungssätze' }
      }
    ]
  },
  {
    path: '',
    title: 'Fahrtkostenabrechnung JDAV Bayern',
    component: ReimbursementComponent,
    children: [
      {
        path: 'kurs',
        component: MeetingCourseStepComponent
      },
      {
        path: 'ljv',
        component: MeetingAssemblyStepComponent
      },
      {
        path: 'gremium',
        component: MeetingCommitteeStepComponent
      },
      {
        path: 'teilnehmer_in',
        component: ParticipantStepComponent,
        canActivate: [meetingGuard]
      },
      {
        path: 'auslagen',
        component: ExpensesStepComponent,
        canActivate: [meetingGuard, participantGuard]
      },
      {
        path: 'auslagen-gremium',
        component: ExpensesExtraStepComponent,
        canActivate: [
          meetingGuard,
          participantGuard,
          transportExpensesGuard,
          disabledStepGuard
        ]
      },
      {
        path: 'zusammenfassung',
        component: OverviewStepComponent,
        canActivate: [meetingGuard, participantGuard, expensesGuard]
      }
    ]
  }
];
