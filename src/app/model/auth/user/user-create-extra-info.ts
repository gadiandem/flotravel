import { User } from './user';

import { UserGroup } from '../agency/user-group';
import { Agent } from '../agency/agency';

export class UserCreateExtraInfo extends User {
  agentList: Agent[];
  userGroupList: UserGroup[];
}
