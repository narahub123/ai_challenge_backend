/**
 * Pagination 정보 DTO
 */
export class PaginationDto {
  total: number;      // 전체 항목 수
  page: number;       // 현재 페이지
  limit: number;      // 페이지당 항목 수
  total_pages: number; // 전체 페이지 수

  constructor(total: number, page: number, limit: number) {
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.total_pages = Math.ceil(total / limit);
  }
}

