import { Address } from './address.model';

export interface Participant {
  givenName: string;
  familyName: string;
  sectionId: number;
  email: string;
  address: Address;
  bankAccount: BankAccount;
}

export interface BankAccount {
  iban: string;
  bic?: string;
}
