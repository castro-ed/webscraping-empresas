import * as XLSX from 'xlsx';
import type { Company, ExportFormat } from '@/types';

/**
 * Gera workbook do SheetJS a partir dos dados de empresas.
 */
function buildWorkbook(data: Company[]): XLSX.WorkBook {
  const rows = data.map((company, index) => ({
    '#': index + 1,
    'Nome da Empresa': company.name,
    'Endereço': company.address,
    'Telefone': company.phone,
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Ajusta largura das colunas
  worksheet['!cols'] = [
    { wch: 5 },
    { wch: 40 },
    { wch: 50 },
    { wch: 20 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Empresas');

  return workbook;
}

/**
 * Faz download de um arquivo no navegador.
 */
function download(data: ArrayBuffer | string, filename: string, mimeType: string): void {
  const blob = new Blob([data], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exporta dados para CSV.
 */
export function exportToCSV(data: Company[], filename = 'empresas'): void {
  const workbook = buildWorkbook(data);
  const csv = XLSX.utils.sheet_to_csv(workbook.Sheets['Empresas'], { FS: ';' });
  download(csv, `${filename}.csv`, 'text/csv;charset=utf-8');
}

/**
 * Exporta dados para XLSX.
 */
export function exportToXLSX(data: Company[], filename = 'empresas'): void {
  const workbook = buildWorkbook(data);
  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  download(
    buffer,
    `${filename}.xlsx`,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
}

/**
 * Exporta dados no formato escolhido.
 */
export function exportData(data: Company[], format: ExportFormat, filename?: string): void {
  if (format === 'csv') {
    exportToCSV(data, filename);
  } else {
    exportToXLSX(data, filename);
  }
}
