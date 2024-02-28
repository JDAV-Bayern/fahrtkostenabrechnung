export interface Participant {
  name: string;
  street: string;
  zipCode: string;
  city: string;
  iban: string;
  bic?: string;
  isBavaria: boolean;
}
