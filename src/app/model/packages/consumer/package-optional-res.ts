import { SupplementPackageRes } from "./supplement-package-res";
import { TourPackageRes } from "./tour-package-res";
import { TransferPackageRes } from "./transfer-pacakge-res";

export class PackageOptionalRes {
    supplements: SupplementPackageRes[];
    tours: TourPackageRes[];
    transfers: TransferPackageRes[];
}