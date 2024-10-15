import { AddressDto } from './address.dto';

export interface ParticipantDto {
  given_name: string;
  family_name: string;
  section_id: number;
  email: string;
  address: AddressDto;
  bank_account: BankAccountDto;
}

export interface BankAccountDto {
  iban: string;
  bic?: string;
}
