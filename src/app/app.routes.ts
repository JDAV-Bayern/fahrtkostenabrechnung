import { Routes } from '@angular/router';
import { PageNotFound } from './core/page-not-found/page-not-found';
import { DataProtectionComponent } from './info/data-protection/data-protection.component';
import { ExpenseRatesComponent } from './info/expense-rates/expense-rates.component';
import { InfoComponent } from './info/info.component';
import { CommitteeSteps } from './reimbursement/committee-steps/committee-steps';
import { CourseSteps } from './reimbursement/course-steps/course-steps';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'fahrtkosten/kurs',
    pathMatch: 'full',
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
        data: { breadcrumb: 'Datenschutzerklärung' },
      },
      {
        path: 'erstattungssaetze',
        title: 'Erstattungssätze',
        component: ExpenseRatesComponent,
        data: { breadcrumb: 'Erstattungssätze' },
      },
    ],
  },
  {
    path: 'fahrtkosten',
    redirectTo: 'fahrtkosten/kurs',
    pathMatch: 'full',
  },
  {
    path: 'fahrtkosten/:step',
    title: 'Fahrtkostenabrechnung | JDAV Bayern',
    component: CourseSteps,
  },
  {
    path: 'fahrtkosten-gremium',
    redirectTo: 'fahrtkosten-gremium/reisedaten',
    pathMatch: 'full',
  },
  {
    path: 'fahrtkosten-gremium/:step',
    title: 'Fahrtkostenabrechnung Gremien | JDAV Bayern',
    component: CommitteeSteps,
  },
  {
    path: '**',
    component: PageNotFound,
  },
];
