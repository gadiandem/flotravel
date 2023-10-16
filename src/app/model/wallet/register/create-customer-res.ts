import { FlocashBaseResponse } from "../flocash-base-response";
import { UserInfo } from "../profile/user-info";

export class CreateCustomerRes extends FlocashBaseResponse {
    user: UserInfo;
}