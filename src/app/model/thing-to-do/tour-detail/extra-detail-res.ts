import { ExtraDetailAvailabilityInfo } from "./extra-detail-availability";
import { ExtraDetailInfo } from "./extra-detail-info";
import { ExtraPackageAvailabilityInfo } from "./extra-package-availability-info";

export class ExtraDetailRes {
    extraPackageAvailability: ExtraPackageAvailabilityInfo[];
    extraDetailAvailabilityList: ExtraDetailAvailabilityInfo[];
    extraDetailList: ExtraDetailInfo[]
}