export interface Company {
  name: string;
  address: string;
  phone: string;
  email?: string;
  website?: string;
}

export interface SearchParams {
  query: string;
  location: string;
}

export interface SearchResponse {
  results: Company[];
  total: number;
  query: string;
  location: string;
  isPartial?: boolean; // Indica se a busca foi interrompida por timeout
}

export type ExportFormat = "csv" | "xlsx";

export type SortDirection = "asc" | "desc";

export interface SortConfig {
  key: keyof Company;
  direction: SortDirection;
}
