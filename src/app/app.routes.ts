import { Routes } from '@angular/router';
import { autoLoginPartialRoutesGuard } from 'angular-auth-oidc-client';
import { UserProfileComponent } from './auth/user-profile/user-profile.component';
import { Badges } from './badges/badges';
import { PageNotFound } from './core/page-not-found/page-not-found';
import { FeedbackAdmin } from './feedback/feedback-admin/feedback-admin';
import { FeedbackResults } from './feedback/feedback-results/feedback-results';
import { Feedback } from './feedback/feedback/feedback';
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
    path: 'gremium',
    redirectTo: 'fahrtkosten-gremium/reisedaten',
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
    path: 'marken',
    title: 'Markenbestellung | JDAV Bayern',
    component: Badges,
    data: { headerTitle: 'Markenbestellung', headerHideRemoveDataButton: true },
  },
  {
    path: 'feedback',
    title: 'Feedback | JDAV Bayern',
    component: Feedback,
    data: { headerTitle: 'Feedback', headerHideRemoveDataButton: true },
  },
  {
    path: 'feedback-admin',
    title: 'Feedback Admin | JDAV Bayern',
    component: FeedbackAdmin,
    canActivate: [autoLoginPartialRoutesGuard],
    data: { headerTitle: 'Feedback Admin', headerHideRemoveDataButton: true },
  },
  {
    path: 'feedback-ergebnisse',
    title: 'Feedback Ergebnisse | JDAV Bayern',
    component: FeedbackResults,
    data: {
      headerTitle: 'Feedback Ergebnisse',
      headerHideRemoveDataButton: true,
    },
  },
  {
    path: 'meine-kurse',
    title: 'Meine Kurse | JDAV Bayern',
    component: UserProfileComponent,
    canActivate: [autoLoginPartialRoutesGuard],
    data: {
      headerTitle: 'Dein Nutzerprofil',
      headerHideRemoveDataButton: true,
    },
  },
  {
    path: '**',
    component: PageNotFound,
  },
];
