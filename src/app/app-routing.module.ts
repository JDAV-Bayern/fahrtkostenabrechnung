import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalInformationComponent } from './travel-expenses/personal-information/personal-information.component';
import { SubmissionOverviewComponent } from './travel-expenses/submission-overview/submission-overview.component';
import { ExpensesCollectionComponent } from './travel-expenses/expenses-collection/expenses-collection.component';
import { DataProtectionComponent } from './info/data-protection/data-protection.component';
import { InfoComponent } from './info/info.component';
import { TravelExpensesComponent } from './travel-expenses/travel-expenses.component';
import { CourseDataComponent } from './travel-expenses/course-data/course-data.component';
import { courseGuard, expensesGuard, participantGuard } from './route-guards';

const routes: Routes = [
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
        path: 'teilnehmer-in',
        component: PersonalInformationComponent,
        canActivate: [courseGuard]
      },
      {
        path: 'auslagen',
        component: ExpensesCollectionComponent,
        canActivate: [courseGuard, participantGuard]
      },
      {
        path: 'zusammenfassung',
        component: SubmissionOverviewComponent,
        canActivate: [courseGuard, participantGuard, expensesGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
