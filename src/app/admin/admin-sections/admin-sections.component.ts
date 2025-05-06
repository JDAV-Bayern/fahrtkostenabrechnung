import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SectionDTO, SectionsService } from 'src/app/api';

@Component({
  selector: 'app-admin-sections',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-sections.component.html',
  styleUrl: './admin-sections.component.css'
})
export class AdminSectionsComponent {
  private readonly sectionService = inject(SectionsService);

  sections: SectionDTO[] = [];
  allSections: SectionDTO[] = [];

  sectionToEdit: (SectionDTO & { originalNumber: number | null }) | null = null;

  searchValue = '';

  async ngOnInit() {
    this.updateSections();
  }
  updateSections() {
    this.sectionService.getSections().subscribe(observable => {
      this.allSections = observable.sections;
      this.search();
    });
  }

  search() {
    this.sections = this.allSections.filter(
      section =>
        section.name.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        section.number.toString().includes(this.searchValue)
    );
    this.sections.sort((a, b) => a.number - b.number);
  }

  createSection() {
    this.sectionToEdit = {
      number: this.allSections.length + 1,
      name: '',
      originalNumber: null
    };
  }

  async importSections(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList && fileList.length === 1) {
      this.sectionService.importSections(fileList[0]).subscribe(() => {
        this.updateSections();
      });
    }
  }

  observer = {
    next: () => {},
    error: (error: HttpResponse<any>) => {
      let errorText = 'unknown error';
      try {
        errorText = (error as unknown as { error: { detail: string } }).error
          ?.detail;
      } catch (e) {}
      alert(
        'Fehler beim Speichern der Sektion: ' + error.status + '\n' + errorText
      );
    },
    complete: () => {
      this.updateSections();
    }
  };

  deleteSection(section: SectionDTO) {
    if (
      confirm(
        `Bist Du sicher, dass Du die Sektion ${section.name} löschen möchtest?`
      )
    ) {
      this.sectionService
        .deleteSection(section.number)
        .subscribe(this.observer);
    }
  }
  saveSection() {
    if (!this.sectionToEdit) {
      return;
    }
    if (this.sectionToEdit.originalNumber !== null) {
      this.sectionService
        .updateSection(
          this.sectionToEdit.originalNumber,
          this.sectionToEdit,
          'response'
        )
        .subscribe(this.observer);
    } else {
      this.sectionService
        .createSection(this.sectionToEdit, 'response')
        .subscribe(this.observer);
    }
    this.sectionToEdit = null;
  }
  editSection(section: SectionDTO) {
    this.sectionToEdit = { ...section, originalNumber: section.number };
  }
}
