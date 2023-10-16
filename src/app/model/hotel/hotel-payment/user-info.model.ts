import { GENDER } from "../../enum/gender";

export class UserInfoModel {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  // gender: Gender;
  gender: GENDER;
  middleName: string;
  country: string;
  surName: string;
  isNotify: boolean;
  passport: string;
}
