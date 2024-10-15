export interface Country {
  id: number;
  name: string;
}

export interface Locality {
  postalCode: string;
  name: string;
  countryId: number;
}

export interface Address {
  line1: string;
  line2?: string | null;
  postalCode: string;
  locality: string;
  countryId: number;
}
