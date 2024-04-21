import { Routes } from '@angular/router';
import { ParticipantStepComponent } from './travel/participant-step/participant-step.component';
import { OverviewStepComponent } from './travel/overview-step/overview-step.component';
import { ExpensesStepComponent } from './travel/expenses-step/expenses-step.component';
import { DataProtectionComponent } from './info/data-protection/data-protection.component';
import { InfoComponent } from './info/info.component';
import { TravelExpensesComponent } from './travel/travel.component';
import { MeetingCourseStepComponent } from './travel/meeting-course-step/meeting-course-step.component';
import {
  meetingGuard,
  transportExpensesGuard,
  participantGuard,
  foodExpensesGuard,
  materialExpensesGuard
} from './travel/shared/travel.guard';
import { MeetingAssemblyStepComponent } from './travel/meeting-assembly-step/meeting-assembly-step.component';
import { MeetingCommitteeStepComponent } from './travel/meeting-committee-step/meeting-committee-step.component';
import { ExpensesExtraStepComponent } from './travel/expenses-extra-step/expenses-extra-step.component';
import { ExpenseRatesComponent } from './info/expense-rates/expense-rates.component';

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
    component: TravelExpensesComponent,
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
        canActivate: [meetingGuard, participantGuard, transportExpensesGuard]
      },
      {
        path: 'zusammenfassung',
        component: OverviewStepComponent,
        canActivate: [
          meetingGuard,
          participantGuard,
          transportExpensesGuard,
          foodExpensesGuard,
          materialExpensesGuard
        ]
      }
    ]
  }
];
