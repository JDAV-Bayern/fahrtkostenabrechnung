export interface Participant {
  givenName: string;
  surname: string;
  sectionId: number;
  zipCode: string;
  city: string;
  iban: string;
  bic?: string;
}
