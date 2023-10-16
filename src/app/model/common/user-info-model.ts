import { GENDER } from "../enum/gender";

export class UserInfoModel {
  gender: GENDER;
  middleName: string;
  firstName: string;
  lastName: string;
  email: string;
  confirmEmail: string;
  mobile: string;
  isNotify: boolean;
  country: string;
  passport: string;
  // pinCode: number;
}
