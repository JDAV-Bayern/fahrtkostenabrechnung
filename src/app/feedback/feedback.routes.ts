import { Routes } from '@angular/router';
import { autoLoginPartialRoutesGuard } from 'angular-auth-oidc-client';
import { FeedbackAdmin } from './feedback-admin/feedback-admin';
import { FeedbackResults } from './feedback-results/feedback-results';
import { Feedback } from './feedback/feedback';

const routes: Routes = [
  {
    path: '',
    title: 'Feedback | JDAV Bayern',
    component: Feedback,
    data: { headerTitle: 'Feedback', headerHideRemoveDataButton: true },
  },
  {
    path: 'ergebnisse',
    title: 'Feedback Ergebnisse | JDAV Bayern',
    component: FeedbackResults,
    data: {
      headerTitle: 'Feedback Ergebnisse',
      headerHideRemoveDataButton: true,
    },
  },
  {
    path: 'admin',
    title: 'Feedback Admin | JDAV Bayern',
    component: FeedbackAdmin,
    canActivate: [autoLoginPartialRoutesGuard],
    data: {
      headerTitle: 'Feedback Admin',
      headerHideRemoveDataButton: true,
    },
  },
];

export default routes;
