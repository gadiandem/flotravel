import { FlocashBaseResponse } from "../../wallet/flocash-base-response";

export class WalletCredential extends FlocashBaseResponse {
    email: string;
    password: string;
    apiUser: string;
    apiPassword: string;
}