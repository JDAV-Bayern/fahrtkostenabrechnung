export interface Participant {
  name: string;
  sectionId: number;
  street: string;
  zipCode: string;
  city: string;
  iban: string;
  bic?: string;
}
