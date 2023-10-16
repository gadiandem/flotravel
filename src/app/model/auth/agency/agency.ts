import { User } from '../user/user';
import { AgentInfo } from './agent-info';
import { Tariff } from './tariff';
import { UserGroup } from './user-group';

export class Agent {
  id: string;
  // agentId: string;
  name: string;
  agentInfo: AgentInfo;
  parent: string;
  userIds: string[];
  userList: User[];
  owner: string;
  tariff: Tariff;
  userGroupList: UserGroup[];
  subAgents: Agent[];
  subAgentIds: string[];
}
