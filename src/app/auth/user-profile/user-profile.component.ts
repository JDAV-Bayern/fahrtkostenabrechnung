import { CommonModule } from '@angular/common';
import { Component, computed, inject, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { OidcSecurityService, UserDataResult } from 'angular-auth-oidc-client';

interface ParticipatedTraining {
  id: number;
  title: string;
  code: string;
  date_from: string;
}

interface ProfileData {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  jdav_membership_number: string;
  email: string;
  email_verified: boolean;
  participated_trainings?: ParticipatedTraining[];
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  imports: [CommonModule],
  host: {
    class: 'block bg-gray-50',
  },
})
export class UserProfileComponent {
  private readonly oidc = inject(OidcSecurityService);
  private readonly router = inject(Router);

  readonly authState = this.oidc.authenticated;
  readonly userData = this.oidc.userData as Signal<UserDataResult>;
  readonly profile = computed<ProfileData | null>(() => {
    const data = this.userData().userData as ProfileData | undefined;
    return data ?? null;
  });

  sortTrainingsByDate(
    trainings: ParticipatedTraining[] | undefined,
  ): ParticipatedTraining[] {
    if (!trainings) {
      return [];
    }
    return trainings.slice().sort((a, b) => {
      const dateA = new Date(a.date_from).getTime();
      const dateB = new Date(b.date_from).getTime();
      return dateA - dateB;
    });
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
        schulungsnummer: training.code,
      },
    });
  }
}
