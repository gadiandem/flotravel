export class PayerInfo {
  // gender: Gender;
  gender: string;
  birthDate: string;
  issueDate: string;
  email?: string;
  expiryDate: string;
  phoneNo: string;
  address: string;
  firstName: string;
  lastName: string;
  middleName: string;
  country: string;
  passPort: string;
  notify: boolean;
}

export enum Gender {
  MALE, FEMALE, UNSPECIFIED
}
