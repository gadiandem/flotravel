import { FlocashBaseResponse } from "../flocash-base-response";
import { UserInfo } from "./user-info";

export class UserInfoRes extends FlocashBaseResponse {
    user: UserInfo;
}