import { FlocashBaseResponse } from "../../wallet/flocash-base-response";
import { StateInfo } from "./state-info";

export class StateListRes extends FlocashBaseResponse {
    states: StateInfo[];
}