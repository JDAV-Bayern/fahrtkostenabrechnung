import { Routes } from '@angular/router';
import { DataProtectionComponent } from './info/data-protection/data-protection.component';
import { ExpenseRatesComponent } from './info/expense-rates/expense-rates.component';
import { InfoComponent } from './info/info.component';
import { ExpensesExtraStepComponent } from './reimbursement/expenses-extra-step/expenses-extra-step.component';
import { ExpensesStepComponent } from './reimbursement/expenses-step/expenses-step.component';
import { MeetingAssemblyStepComponent } from './reimbursement/meeting-assembly-step/meeting-assembly-step.component';
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
import { isAdmin } from './auth/guards';
import { autoLoginPartialRoutesGuard } from 'angular-auth-oidc-client';
import { AdminComponent } from './admin/admin.component';
import { ErrorComponent } from './error/error.component';

export const routes: Routes = [
  {
    path: 'error',
    title: 'Ein Fehler ist aufgetreten',
    component: ErrorComponent
  },
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
      },
      {
        path: 'admin',
        component: AdminComponent,
        canActivate: [autoLoginPartialRoutesGuard, isAdmin],
      },
    ],

  }
];
