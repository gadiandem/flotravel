import { FlocashBaseResponse } from "../flocash-base-response";
import { UserProfile } from "./user-profile";

export class UserProfileRes extends FlocashBaseResponse {
    profile: UserProfile;
}