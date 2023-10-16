import { CreateCustomerReq } from "./create-customer-req";

export class CustomerWithWalletReq extends CreateCustomerReq {
    agentName: string;
}