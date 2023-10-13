import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';
import { PersonalInformationComponentComponent } from './personal-information-component/personal-information-component.component';
import { SubmissionOverviewComponentComponent } from './submission-overview-component/submission-overview-component.component';
import { ExpensesCollectionComponentComponent } from './expenses-collection-component/expenses-collection-component.component';

const routes: Routes = [
  { path: 'kurs-und-personen-infos', component: PersonalInformationComponentComponent },
  { path: 'auslagen', component: ExpensesCollectionComponentComponent },
  { path: 'zusammenfassen-und-abschicken', component: SubmissionOverviewComponentComponent },
  { path: '', redirectTo: '/kurs-und-personen-infos', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
