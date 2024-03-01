export interface Participant {
  givenName: string;
  familyName: string;
  sectionId: number;
  zipCode: string;
  city: string;
  iban: string;
  bic?: string;
}
