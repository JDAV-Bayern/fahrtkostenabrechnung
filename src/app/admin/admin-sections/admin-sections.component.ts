import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { BackendService } from 'src/app/shared/backend-service';
import { api } from 'src/app/shared/generated-types';

@Component({
  selector: 'app-admin-sections',
  imports: [CommonModule],
  templateUrl: './admin-sections.component.html',
  styleUrl: './admin-sections.component.css'
})
export class AdminSectionsComponent {
  private readonly backendService = inject(BackendService);

  sections: Awaited<ReturnType<typeof api.get_sections_sections_get>> = {
    sections: []
  };

  async ngOnInit() {
    const client = await this.backendService.getClient();
    this.sections = await client.get_sections_sections_get();
    console.log(this.sections);
  }
}
