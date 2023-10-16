import { TokenDetail } from './token-detail';

export class AuthResponse {
  clientId: string;
  tokenDetail: TokenDetail;
  sabre_token: string;
  sabretoken_type: string;
  sabreTokenExpires_in: string;
  statusAPI: string;
}
