import { PackageInfo } from "../package-info";
import { TourPackage } from "../tour-package";

export class PaginationTourPackage {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    items: TourPackage[];
}