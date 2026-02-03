import { Routes } from '@angular/router';
import { autoLoginPartialRoutesGuard } from 'angular-auth-oidc-client';
import { FeedbackAdmin } from './feedback-admin/feedback-admin';
import { FeedbackResults } from './feedback-results/feedback-results';
import { Feedback } from './feedback/feedback';

const routes: Routes = [
  {
    path: '',
    title: 'Feedback',
    component: Feedback,
  },
  {
    path: 'ergebnisse',
    title: 'Feedback Ergebnisse',
    component: FeedbackResults,
  },
  {
    path: 'admin',
    title: 'Feedback Admin',
    component: FeedbackAdmin,
    canActivate: [autoLoginPartialRoutesGuard],
  },
];

export default routes;
