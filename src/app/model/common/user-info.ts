export class UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  gender: Gender;
  // gender: string;
  middleName: string;
  country: string;
  birthDate: string;
  surName: string;
  isNofity: boolean;
  passport: string;
}

export enum Gender {
  Male,
  Female,
  Other
}
