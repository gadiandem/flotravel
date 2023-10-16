import { User } from '../user/user';

export class UserGroup {
  id?: string;
  // rank: number;
  value: string;
  primary: boolean;
  icon: string;
  createDate: string;
  userList?: User[];
}
