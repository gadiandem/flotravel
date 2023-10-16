import { User } from './user';

import { UserGroup } from '../agency/user-group';
import { Agent } from '../agency/agency';
import {BalanceSummary} from '../../wallet/summary/balance-summary';
export class UserDetail extends User {
  agent?: Agent;
  userGroups: UserGroup[];
  agentList: Agent[];
  walletBalance: BalanceSummary[];
}
