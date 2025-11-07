/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
import * as XLSX from 'xlsx';


export interface BaseRecord {
  id: string;
  Vorname: string;
  Nachname: string;
  Geburtsdatum: string;
}

export class AdditionalColumn {
  name: string;
  file: string;
  constructor(name: string, file: string) {
    this.name = name;
    this.file = file;
  }
  id(): string {
    return this.name + '_' + this.file;
  }
}

export interface MvManagerRecord extends BaseRecord {
  Sektion: string;
  [additionalField: string]: string;
}

export interface AdditionalFileRecord extends BaseRecord {
  [additionalField: string]: string;
}

export interface ReadResult<T extends BaseRecord> {
  file: string;
  records: T[];
  errors: string[];
  additionalColumns: AdditionalColumn[];
}

function generateId(vorname: string, nachname: string, geburtsdatum: string): string {
  return `${vorname.toLowerCase().trim()}_${nachname.toLowerCase().trim()}_${geburtsdatum.replace(/\./g, '-')}`;
}

function validateRequiredFields(record: any, requiredFields: string[]): boolean {
  return requiredFields.every(field => record[field] && record[field].toString().trim() !== '');
}

function isEmptyRecord(record: any): boolean {
  return Object.values(record).every(value =>
    value === null || value === undefined || value.toString().trim() === ''
  );
}

function parseCsv(text: string): string[][] {
  const lines = text.split('\n');
  return lines.map(line => {
    return line.split(';').map(field => {
      return field.trim().replace(/^"(.*)"$/, '$1');
    });
  });
}

function csvToArrayOfObjects(data: string[][]): any[] {
  if (data.length === 0) return [];

  const headers = data[0];
  const rows = data.slice(1);

  return rows.map(row => {
    const obj: any = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] || '';
    });
    return obj;
  });
}

export function readMvManager(file: File): Promise<ReadResult<MvManagerRecord>> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        let records: any[];
        const additionalColumns = new Set<string>();

        if (file.name.endsWith('.csv')) {
          const csvData = event.target?.result as string;
          const parsedData = parseCsv(csvData);
          records = csvToArrayOfObjects(parsedData);
        } else {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          records = XLSX.utils.sheet_to_json(worksheet);
        }

        const requiredColumns = ['Vorname', 'Nachname', 'Geburtsdatum', 'Sektion'];
        const availableColumns = Object.keys(records[0]);
        const missingColumns = requiredColumns.filter(col => !availableColumns.includes(col));
        if (missingColumns.length > 0) {
          reject(new Error('Fehlende erforderliche Spalten: ' + missingColumns.join(', ')));
          return;
        }

        const result: MvManagerRecord[] = [];
        const errors: string[] = [];
        const seenIds = new Set<string>();

        for (const record of records) {
          if (isEmptyRecord(record)) {
            continue;
          }

          let geburtsdatum = record['Geburtsdatum'];
          if (geburtsdatum instanceof Date) {
            geburtsdatum = `${geburtsdatum.getDate().toString().padStart(2, '0')}.${(geburtsdatum.getMonth() + 1).toString().padStart(2, '0')}.${geburtsdatum.getFullYear()}`;
          } else if (typeof geburtsdatum === 'number') {
            // Handle Excel date numbers
            const date = new Date((geburtsdatum - 25569) * 86400 * 1000);
            geburtsdatum = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
          }

          record['Geburtsdatum'] = geburtsdatum;

          if (!validateRequiredFields(record, requiredColumns)) {
            errors.push(`Fehlende erforderliche Felder in Datensatz: ${JSON.stringify(record)}`);
            continue;
          }

          for (const key of Object.keys(record)) {
            if (!requiredColumns.includes(key)) {
              additionalColumns.add(key);
            }
          }

          const id = generateId(record['Vorname'], record['Nachname'], record['Geburtsdatum']);

          if (seenIds.has(id)) {
            console.warn(`Jugendleiter*in ${JSON.stringify(record)} ist doppelt im MV Manager Datensatz.`);
            errors.push(`Jugendleiter*in ${record['Vorname']} ${record['Nachname']} (${record['Geburtsdatum']}) ist doppelt im MV Manager Datensatz.`);
            continue;
          }

          seenIds.add(id);

          result.push({
            ...record,
            id,
            Geburtsdatum: record['Geburtsdatum'],
          });
        }

        resolve({
          file: file.name,
          records: result,
          errors,
          additionalColumns: Array.from(additionalColumns).map(col => new AdditionalColumn(col, file.name))
        });
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Fehler beim Lesen der Datei'));
    };

    if (file.name.endsWith('.csv')) {
      reader.readAsText(file, 'utf-8');
    } else {
      reader.readAsArrayBuffer(file);
    }
  });
}

export function readAdditionalFile(file: File): Promise<ReadResult<AdditionalFileRecord>> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        let records: any[];
        const additionalColumns = new Set<string>();

        if (file.name.endsWith('.csv')) {
          const csvData = event.target?.result as string;
          const parsedData = parseCsv(csvData);
          records = csvToArrayOfObjects(parsedData);
        } else {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          records = XLSX.utils.sheet_to_json(worksheet);
        }

        const availableColumns = Object.keys(records[0]);
        const requiredColumns = ['Vorname', 'Nachname', 'Geburtsdatum'];
        const missingColumns = requiredColumns.filter(col => !availableColumns.includes(col));
        if (missingColumns.length > 0) {
          reject(new Error('Fehlende erforderliche Spalten: ' + missingColumns.join(', ')));
          return;
        }

        const result: AdditionalFileRecord[] = [];

        for (const record of records) {
          if (isEmptyRecord(record)) {
            continue;
          }

          for (const key of Object.keys(record)) {
            if (!requiredColumns.includes(key)) {
              additionalColumns.add(key);
            }
          }

          let geburtsdatum = record['Geburtsdatum'];
          if (geburtsdatum instanceof Date) {
            geburtsdatum = `${geburtsdatum.getDate().toString().padStart(2, '0')}.${(geburtsdatum.getMonth() + 1).toString().padStart(2, '0')}.${geburtsdatum.getFullYear()}`;
          } else if (typeof geburtsdatum === 'number') {
            const date = new Date((geburtsdatum - 25569) * 86400 * 1000);
            geburtsdatum = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
          }

          record['Geburtsdatum'] = geburtsdatum;

          const id = generateId(record['Vorname'], record['Nachname'], record['Geburtsdatum']);

          result.push({
            ...record,
            id,
            Geburtsdatum: record['Geburtsdatum'],
          });
        }

        resolve({
          file: file.name,
          records: result,
          errors: [],
          additionalColumns: Array.from(additionalColumns).map(col => new AdditionalColumn(col, file.name))
        });
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Fehler beim Lesen der Datei'));
    };

    if (file.name.endsWith('.csv')) {
      reader.readAsText(file, 'utf-8');
    } else {
      reader.readAsArrayBuffer(file);
    }
  });
}
