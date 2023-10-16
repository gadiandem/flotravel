import { PackageInfo } from "../package-info";
import { SupplementPackage } from "../supplement-package";

export class PaginationSupplementPackage {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    items: SupplementPackage[];
}