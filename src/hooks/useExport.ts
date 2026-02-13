'use client';

import { useCallback } from 'react';
import type { Company, ExportFormat } from '@/types';
import { exportData } from '@/utils/export';

interface UseExportReturn {
  handleExport: (format: ExportFormat) => void;
}

export function useExport(data: Company[]): UseExportReturn {
  const handleExport = useCallback(
    (format: ExportFormat) => {
      if (data.length === 0) return;

      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `suporgi-empresas-${timestamp}`;
      exportData(data, format, filename);
    },
    [data]
  );

  return { handleExport };
}
