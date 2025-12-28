import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CsvExportService {
  exportToCsv(
    data: any[],
    fileName: string,
    headers?: { [key: string]: string },
    excludedFields: string[] = []
  ): void {
    if (!data || data.length === 0) {
      console.error('Nenhum dado fornecido para exportação CSV');
      return;
    }

    const availableFields = Object.keys(data[0]).filter(
      (field) => !excludedFields.includes(field)
    );

    const csvHeaders = availableFields.map(
      (field) => headers?.[field] || field
    );

    // Processa as linhas de dados
    const csvRows = data.map((row) => {
      return availableFields
        .map((field) => {
          let value = row[field];

          if (value === null || value === undefined) {
            return '';
          }

          if (value instanceof Date) {
            return value.toISOString();
          }

          if (
            typeof value === 'string' &&
            (value.includes(',') || value.includes('\n') || value.includes('"'))
          ) {
            return `"${value.replace(/"/g, '""')}"`;
          }

          return String(value);
        })
        .join(',');
    });

    const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');

    this.downloadFile(csvContent, fileName, 'text/csv;charset=utf-8;');
  }

  private downloadFile(
    content: string,
    fileName: string,
    contentType: string
  ): void {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Libera memória
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }
}
