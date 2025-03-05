import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BackendService } from 'src/app/shared/backend-service';
import { SectionDTOType } from 'src/app/shared/generated-types/generated-types';
import { SectionFormComponent } from './section-form/section-form.component';

@Component({
  selector: 'app-admin-sections',
  imports: [CommonModule, FormsModule, SectionFormComponent],
  templateUrl: './admin-sections.component.html',
  styleUrl: './admin-sections.component.css'
})
export class AdminSectionsComponent {
  private readonly backendService = inject(BackendService);

  searchValue = '';

  sections: SectionDTOType[] = [];
  allSections: SectionDTOType[] = [];

  sectionToEdit: SectionDTOType | undefined;

  async ngOnInit() {
    await this.updateSections();
  }

  async updateSections() {
    const client = await this.backendService.getClient();
    const sectionResponse = await client.get_sections_sections_get();
    this.sections = sectionResponse.sections;
    this.allSections = this.sections;
    this.search();
  }

  search() {
    this.sections = this.allSections.filter(
      section =>
        section.name.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        section.number.toString().includes(this.searchValue)
    );
    this.sections.sort((a, b) => a.number - b.number);
  }

  async deleteSection(id: number) {
    const client = await this.backendService.getClient();
    await client.delete_section_sections__number__delete(undefined, {
      params: { number: id }
    });
    await this.updateSections();
  }

  async createSection() {}

  async editSection(section: SectionDTOType) {
    this.sectionToEdit = section;
  }
}
