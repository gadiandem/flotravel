import { User } from './user';

export class UserRes {
  error: string;
  status: string;
  message: string;
  user: User;
}
