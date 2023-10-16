import { PackageInfo } from "../package-info";

export class PaginationPackageInfo {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    items: PackageInfo[];
}