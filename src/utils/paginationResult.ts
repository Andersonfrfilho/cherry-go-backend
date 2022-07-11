interface ParamsDTO {
  limit: number;
  skip: number;
  total: number;
}
interface ReturnPaginationResult {
  current_page: number;
  pages_total: number;
  total: number;
}
export function paginationResult({
  limit,
  skip,
  total,
}: ParamsDTO): ReturnPaginationResult {
  const number_page = limit > 0 ? skip / limit + 1 : 1;
  const pages_total = Math.ceil(Number(total) / limit);
  return {
    current_page: number_page,
    pages_total,
    total,
  };
}
