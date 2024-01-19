export interface IParticipantDetails {
    name: string;
    street: string;
    city: string;
    iban: string;
    bic?: string;
    zipCode: string;
    isBavaria: boolean;
}