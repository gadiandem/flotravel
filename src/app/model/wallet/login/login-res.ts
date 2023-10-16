import { FlocashBaseResponse } from "../flocash-base-response";
import { LoginInfoRes } from "./login-info-res";

export class LoginRes extends FlocashBaseResponse {
    login: LoginInfoRes;
}