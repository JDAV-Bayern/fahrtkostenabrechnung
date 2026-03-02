import { Routes } from '@angular/router';
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
  // Legacy redirect
  {
    path: 'admin',
    redirectTo: '/admin/feedback',
  },
];

export default routes;
