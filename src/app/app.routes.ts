import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './core/page-not-found/page-not-found.component';
import { DataProtectionComponent } from './info/data-protection/data-protection.component';
import { ExpenseRatesComponent } from './info/expense-rates/expense-rates.component';
import { InfoComponent } from './info/info.component';
import { ExpensesExtraStepComponent } from './reimbursement/expenses-extra-step/expenses-extra-step.component';
import { ExpensesStepComponent } from './reimbursement/expenses-step/expenses-step.component';
import { MeetingCommitteeStepComponent } from './reimbursement/meeting-committee-step/meeting-committee-step.component';
import { MeetingCourseStepComponent } from './reimbursement/meeting-course-step/meeting-course-step.component';
import { OverviewStepComponent } from './reimbursement/overview-step/overview-step.component';
import { ParticipantStepComponent } from './reimbursement/participant-step/participant-step.component';
import { ReimbursementComponent } from './reimbursement/reimbursement.component';
import { disabledStepGuard } from './reimbursement/shared/disabled-step.guard';
import {
  expensesGuard,
  meetingGuard,
  participantGuard,
  transportExpensesGuard
} from './reimbursement/shared/finished-step.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'fahrtkosten',
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
    path: 'fahrtkosten',
    title: 'Fahrtkostenabrechnung JDAV Bayern',
    component: ReimbursementComponent,
    children: [
      {
        path: '',
        redirectTo: 'kurs',
        pathMatch: 'full'
      },
      {
        path: 'kurs',
        component: MeetingCourseStepComponent
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
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];
