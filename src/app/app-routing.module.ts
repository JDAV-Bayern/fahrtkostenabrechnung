import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalInformationComponentComponent } from './personal-information-component/personal-information-component.component';
import { SubmissionOverviewComponentComponent } from './submission-overview-component/submission-overview-component.component';
import { ExpensesCollectionComponentComponent } from './expenses-collection-component/expenses-collection-component.component';
import { ImprintComponent } from './legal/imprint/imprint.component';
import { DataProtectionComponent } from './legal/data-protection/data-protection.component';

const routes: Routes = [
  { path: 'impressum', component: ImprintComponent },
  { path: 'datenschutz', component: DataProtectionComponent },
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
