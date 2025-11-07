import { Component, ChangeDetectorRef } from '@angular/core';
import { readMvManager, MvManagerRecord, ReadResult, readAdditionalFile, AdditionalFileRecord, AdditionalColumn } from './input_data';

@Component({
  selector: 'jdav-badges',
  imports: [],
  templateUrl: './badges.html',
  styleUrl: './badges.css',
})
export class Badges {
  constructor(private cdr: ChangeDetectorRef) { }

  mvStatus = 'Keine Datei hochgeladen';
  additionalFilesStatus: string[] = []

  mvResult: ReadResult<MvManagerRecord> | null = null;
  additionalFilesResult: ReadResult<AdditionalFileRecord>[] = [];

  getAllAdditionalColumns(): AdditionalColumn[] {
    return [
      ...(this.mvResult ? this.mvResult.additionalColumns : []),
      ...this.additionalFilesResult.flatMap(result =>
        result.additionalColumns
      )
    ];
  }

  onAdditionalFilesSelected(event: any) {
    this.cdr.detectChanges();
    this.additionalFilesStatus = [];
    const files: File [] = event.target.files;
    for (const file of files) {
      if (file) {
        readAdditionalFile(file)
          .then((result) => {
            this.additionalFilesResult.push(result);
            this.additionalFilesStatus.push(`${file.name}: ${result.records.length} Datensätze erfolgreich gelesen`);
            console.log(`Additional file ${file.name} read result:`, result);
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
          this.cdr.detectChanges();
        })
        .catch((error) => {
          this.mvStatus = `Fehler: ${error.message}`;
          console.error('Error reading MV Manager file:', error);
          this.cdr.detectChanges();
        });
    }
  }
}
