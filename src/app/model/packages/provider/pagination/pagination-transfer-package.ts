import { TransferInPackage } from "../transfer-package";

export class PaginationTransferPackage {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    items: TransferInPackage[];
}