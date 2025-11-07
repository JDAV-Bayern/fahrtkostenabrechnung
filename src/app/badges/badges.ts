import { Component, ChangeDetectorRef, Inject, DOCUMENT } from '@angular/core';
import { readMvManager, MvManagerRecord, ReadResult, readAdditionalFile, AdditionalFileRecord, AdditionalColumn } from './input_data';

import * as XLSX from 'xlsx';

@Component({
  selector: 'jdav-badges',
  imports: [],
  templateUrl: './badges.html',
  styleUrl: './badges.css',
})
export class Badges {
  constructor(private cdr: ChangeDetectorRef, @Inject(DOCUMENT) document: Document) { }

  mvStatus = 'Keine Datei hochgeladen';
  additionalFilesStatus: string[] = []

  mvResult: ReadResult<MvManagerRecord> | null = null;
  additionalFilesResult: ReadResult<AdditionalFileRecord>[] = [];

  mergedResult: { keys: string[], records: Record<string, string>[] } | null = null;

  getAllAdditionalColumns(): AdditionalColumn[] {
    return [
      ...(this.mvResult ? this.mvResult.additionalColumns : []),
      ...this.additionalFilesResult.flatMap(result =>
        result.additionalColumns
      )
    ];
  }

  onAdditionalFilesSelected(event: any) {
    this.additionalFilesStatus = [];
    this.cdr.detectChanges();
    const files: File[] = event.target.files;
    for (const file of files) {
      if (file) {
        readAdditionalFile(file)
          .then((result) => {
            this.additionalFilesResult.push(result);
            this.additionalFilesStatus.push(`${file.name}: ${result.records.length} Datensätze erfolgreich gelesen`);
            this.updateMergedResult()
            this.cdr.detectChanges();
          })
          .catch((error) => {
            console.error('Error reading KV Manager file:', error);
            this.cdr.detectChanges();
          });
      }
    }
  }

  onMvManagerFileSelected(event: any) {
    this.mvStatus = 'Datei wird verarbeitet...';
    this.cdr.detectChanges();
    const file: File = event.target.files[0];
    if (file) {
      readMvManager(file)
        .then((result) => {
          this.mvResult = result;
          this.mvStatus = `${result.records.length} Datensätze erfolgreich gelesen`;
          if (result.errors.length > 0) {
            this.mvStatus += '\nFehler beim Einlesen der Datei:';
            for (const error of result.errors) {
              this.mvStatus += `\n${error}`;
            }
          } else {
            this.mvStatus += '\nKeine Fehler beim Einlesen der Datei.';
          }
          this.updateMergedResult()
          this.cdr.detectChanges();
        })
        .catch((error) => {
          this.mvStatus = `Fehler: ${error.message}`;
          console.error('Error reading MV Manager file:', error);
          this.cdr.detectChanges();
        });
    }
  }


  updateMergedResult() {
    if (!this.mvResult) {
      this.mergedResult = { keys: [], records: [] }
      this.cdr.detectChanges()
      return;
    }
    const records: Record<string, string>[] = [];
    const keys = new Set<string>(["Vorname", "Nachname", "Sektion", "Geburtsdatum"]);
    const fileToResult = new Map<string, ReadResult<AdditionalFileRecord>>();
    for (const result of this.additionalFilesResult) {
      fileToResult.set(result.file, result);
    }
    fileToResult.set(this.mvResult.file, this.mvResult);
    const selectedAdditionalColumns = this.getAllAdditionalColumns()
      .filter(
        col => (document.getElementById(`include-${col.id()}`) as HTMLInputElement)?.checked)
      .map(col => ({
        column: col,
        newName: (document.getElementById(`rename-${col.id()}`) as HTMLInputElement)?.value || col.name,
        isDate: (document.getElementById(`date-${col.id()}`) as HTMLInputElement)?.checked
      }));
    for (const mvRecord of this.mvResult.records) {
      const record : Record<string, string> = {
        'Geburtsdatum': mvRecord.Geburtsdatum,
        'Vorname': mvRecord.Vorname,
        'Nachname': mvRecord.Nachname,
        'Sektion': mvRecord.Sektion
       };
      for (const { column, newName, isDate } of selectedAdditionalColumns) {
        keys.add(newName);
        const additionalData = fileToResult.get(column.file)?.records.filter(r => r.id === mvRecord.id)?.map(data => data[column.name] || '').filter(Boolean);
        if(!additionalData){
          record[newName] = ''
          continue;
        }
        record[newName] = Array.from(new Set(additionalData.map(d => {
          if (isDate && typeof(d) === 'number'){
            const date = new Date((d - 25569) * 86400 * 1000);
            return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
          }else{
            return d;
          }
          }))).join(', ')
        }
      records.push(record);
    }
    this.mergedResult = { records, keys: Array.from(keys) };
    this.cdr.detectChanges()
  }

  onFieldNameInputChanged(event: any){
    this.updateMergedResult()
  }

  onIncludeCheckboxChanged(event: any){
    this.updateMergedResult()
  }

  onDateCheckboxChanged(event: any) {
    this.updateMergedResult()
  }

  downloadExcels() {

  }
}
