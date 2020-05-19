export interface ListData {
  tableData: any[];
  paginationData: PaginationData;
}

export interface PaginationData {
  totalRecords: number; // número total de páginas
  pageIndex: number; // indice de la página a mostrar
  pageSize: number; // número de registros por página
}
