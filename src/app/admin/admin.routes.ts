import { Routes } from '@angular/router';
import { autoLoginPartialRoutesGuard } from 'angular-auth-oidc-client';
import { ExpenseConfigAdminComponent } from '../admin/expense-config-admin/expense-config-admin.component';
import { FeedbackAdmin } from './feedback-admin/feedback-admin';
import { MobilityStatistics } from './mobility-statistics/mobility-statistics';

const routes: Routes = [
  {
    path: 'feedback',
    title: 'Feedback Admin',
    component: FeedbackAdmin,
    canActivate: [autoLoginPartialRoutesGuard],
  },
  {
    path: 'erstattungssaetze',
    title: 'Erstattungssätze Admin',
    component: ExpenseConfigAdminComponent,
    canActivate: [autoLoginPartialRoutesGuard],
  },
  {
    path: 'mobilitaetsstatistik',
    title: 'Mobilitätsstatistik',
    component: MobilityStatistics,
    canActivate: [autoLoginPartialRoutesGuard],
  },
];

export default routes;
