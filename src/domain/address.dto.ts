export interface CountryDto {
  id: number;
  name: string;
}

export interface LocalityDto {
  postal_code: string;
  name: string;
  country_id: number;
}

export interface AddressDto {
  line1: string;
  line2?: string;
  postal_code: string;
  locality: string;
  country_id: number;
}
