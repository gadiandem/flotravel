import { GENDER } from "../../enum/gender";

export class PassegerInfo {
  gender: GENDER;
  firstName: string;
  middleName: string;
  lastName: string;
  birthDate?: any;
  issueDate?: string;
  expiryDate?: string;
  address?: string;
  email: string;
  country: string;
  phoneNo: string;
  notify: boolean;
  passPort?: string;
}

enum Gender {
  MALE,
  FEMALE
}
