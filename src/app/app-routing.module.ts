import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalInformationComponentComponent } from './personal-information-component/personal-information-component.component';
import { SubmissionOverviewComponentComponent } from './submission-overview-component/submission-overview-component.component';
import { ExpensesCollectionComponentComponent } from './expenses-collection-component/expenses-collection-component.component';
import { ImprintComponent } from './info/imprint/imprint.component';
import { DataProtectionComponent } from './info/data-protection/data-protection.component';
import { InfoComponent } from './info/info.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'kurs-und-personen-infos',
    pathMatch: 'full',
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
        data: { breadcrumb: 'Impressum' },
      },
      {
        path: 'datenschutz',
        title: 'Datenschutzerklärung',
        component: DataProtectionComponent,
        data: { breadcrumb: 'Datenschutz' },
      },
    ]
  },
  {
    path: '',
    title: 'Fahrtkostenabrechnung JDAV Bayern',
    children: [
      {
        path: 'kurs-und-personen-infos',
        component: PersonalInformationComponentComponent
      },
      {
        path: 'auslagen',
        component: ExpensesCollectionComponentComponent
      },
      {
        path: 'zusammenfassen-und-abschicken',
        component: SubmissionOverviewComponentComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
