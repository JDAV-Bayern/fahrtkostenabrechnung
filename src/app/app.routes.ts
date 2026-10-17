import { Routes } from '@angular/router';
import { autoLoginPartialRoutesGuard } from 'angular-auth-oidc-client';
import { UserProfileComponent } from './auth/user-profile/user-profile.component';
import { Home } from './core/home/home';
import { PageNotFound } from './core/page-not-found/page-not-found';
import { DataProtectionComponent } from './info/data-protection/data-protection.component';
import { ExpenseRatesComponent } from './info/expense-rates/expense-rates.component';
import { InfoComponent } from './info/info.component';
import { CommitteeForm } from './reimbursement/committee-form/committee-form';
import { CourseForm } from './reimbursement/course-form/course-form';

export const routes: Routes = [
  {
    path: '',
    title: 'Portal',
    component: Home,
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
        data: {
          breadcrumb: 'Erstattungssätze',
        },
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
    title: 'Fahrtkostenabrechnung',
    component: CourseForm,
    data: { showDeleteDataButton: true },
  },
  {
    path: 'fahrtkosten-gremium',
    redirectTo: 'fahrtkosten-gremium/reisedaten',
    pathMatch: 'full',
  },
  {
    path: 'fahrtkosten-gremium/:step',
    title: 'Fahrtkostenabrechnung Gremien',
    component: CommitteeForm,
    data: { showDeleteDataButton: true },
  },
  {
    path: 'marken',
    title: 'Markenbestellung',
    loadComponent: () => import('./badges/badges'),
  },
  {
    path: 'feedback',
    loadChildren: () => import('./feedback/feedback.routes'),
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes'),
  },
  {
    path: 'meine-kurse',
    title: 'Meine Kurse',
    component: UserProfileComponent,
    canActivate: [autoLoginPartialRoutesGuard],
  },
  /*
   * Legacy redirects
   */
  {
    path: 'gremium',
    redirectTo: 'fahrtkosten-gremium/reisedaten',
    pathMatch: 'full',
  },
  {
    path: 'feedback-ergebnisse',
    redirectTo: 'feedback/ergebnisse',
    pathMatch: 'full',
  },
  {
    path: 'feedback-admin',
    redirectTo: 'admin/feedback',
    pathMatch: 'full',
  },
  {
    path: '**',
    component: PageNotFound,
  },
];
