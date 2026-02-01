export interface ParticipatedTraining {
  id: number;
  title: string;
  code: string;
  date_from: string;
}

export interface ProfileData {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  jdav_membership_number: string;
  email: string;
  email_verified: boolean;
  participated_trainings?: ParticipatedTraining[];
}
