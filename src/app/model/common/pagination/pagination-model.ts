export class PaginationModel<T> {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  items: T[];
}
