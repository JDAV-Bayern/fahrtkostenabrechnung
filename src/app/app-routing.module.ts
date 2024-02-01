import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalInformationComponent } from './travel-expenses/personal-information/personal-information.component';
import { SubmissionOverviewComponent } from './travel-expenses/submission-overview/submission-overview.component';
import { ExpensesCollectionComponent } from './travel-expenses/expenses-collection/expenses-collection.component';
import { ImprintComponent } from './info/imprint/imprint.component';
import { DataProtectionComponent } from './info/data-protection/data-protection.component';
import { InfoComponent } from './info/info.component';
import { TravelExpensesComponent } from './travel-expenses/travel-expenses.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'kurs-und-personen-infos',
    pathMatch: 'full'
  },
  {
    path: '',
    component: InfoComponent,
    data: { breadcrumb: 'Start' },
    children: [
      {
        path: 'impressum',
        title: 'Impressum',
        component: ImprintComponent,
        data: { breadcrumb: 'Impressum' }
      },
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
        path: 'kurs-und-personen-infos',
        component: PersonalInformationComponent
      },
      {
        path: 'auslagen',
        component: ExpensesCollectionComponent
      },
      {
        path: 'zusammenfassen-und-abschicken',
        component: SubmissionOverviewComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
