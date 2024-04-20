import { Routes } from '@angular/router';
import { PersonalInformationComponent } from './travel-expenses/personal-information/personal-information.component';
import { SubmissionOverviewComponent } from './travel-expenses/submission-overview/submission-overview.component';
import { ExpensesCollectionComponent } from './travel-expenses/expenses-collection/expenses-collection.component';
import { DataProtectionComponent } from './info/data-protection/data-protection.component';
import { InfoComponent } from './info/info.component';
import { TravelExpensesComponent } from './travel-expenses/travel-expenses.component';
import { CourseDataComponent } from './travel-expenses/course-data/course-data.component';
import {
  meetingGuard,
  transportExpensesGuard,
  participantGuard,
  foodExpensesGuard,
  materialExpensesGuard
} from './route-guards';
import { AssemblyDataComponent } from './travel-expenses/assembly-data/assembly-data.component';
import { CommitteeDataComponent } from './travel-expenses/committee-data/committee-data.component';
import { CommitteeExpensesComponent } from './travel-expenses/committee-expenses/committee-expenses.component';

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
        component: CourseDataComponent
      },
      {
        path: 'ljv',
        component: AssemblyDataComponent
      },
      {
        path: 'gremium',
        component: CommitteeDataComponent
      },
      {
        path: 'teilnehmer_in',
        component: PersonalInformationComponent,
        canActivate: [meetingGuard]
      },
      {
        path: 'auslagen',
        component: ExpensesCollectionComponent,
        canActivate: [meetingGuard, participantGuard]
      },
      {
        path: 'auslagen-gremium',
        component: CommitteeExpensesComponent,
        canActivate: [meetingGuard, participantGuard, transportExpensesGuard]
      },
      {
        path: 'zusammenfassung',
        component: SubmissionOverviewComponent,
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
