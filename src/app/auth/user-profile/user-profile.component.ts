import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from 'src/app/shared/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from 'src/app/shared/ui/card';
import { ParticipatedTraining } from '../auth-model';
import { AuthService } from '../auth-service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  imports: [Button, Card, CardContent, CardHeader, CardTitle, DatePipe],
  host: {
    class: 'block h-full bg-gray-50',
  },
})
export class UserProfileComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly userData = this.authService.userData;

  sortTrainingsByDate(
    trainings: ParticipatedTraining[] | undefined,
  ): ParticipatedTraining[] {
    if (!trainings) {
      return [];
    }
    return trainings.slice().sort((a, b) => {
      const dateA = new Date(a.date_from).getTime();
      const dateB = new Date(b.date_from).getTime();
      return dateB - dateA; // Sort descending: most recent first
    });
  }

  isTrainingInFuture(training: ParticipatedTraining): boolean {
    const startTime = new Date(training.date_from).getTime();
    if (Number.isNaN(startTime)) {
      return false;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return startTime > today.getTime();
  }

  navigateToExpenseReport(training: ParticipatedTraining) {
    this.router.navigate(['/fahrtkosten', 'kurs'], {
      queryParams: {
        nummer: training.code,
        name: training.title,
      },
    });
  }

  navigateToFeedback(training: ParticipatedTraining) {
    this.router.navigate(['/feedback'], {
      queryParams: {
        courseId: training.code,
      },
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
