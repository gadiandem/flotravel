import { FlocashBaseResponse } from "../flocash-base-response";
import { VCNInfo } from "./vcn-info";

export class ListAllCardRes extends FlocashBaseResponse {
    vcns: VCNInfo[];
}