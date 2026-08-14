import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataStoreService } from '../../core/services/data-store.service';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-emr',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './emr.component.html',
  styleUrl: './emr.component.scss',
})
export class EmrComponent {
  search = signal('');
  selectedId = signal<string | null>(null);

  constructor(public store: DataStoreService) {}

  filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    return this.store.emrRecords()
      .filter(r => !q || this.store.patientName(r.patientId).toLowerCase().includes(q) || r.diagnosis.toLowerCase().includes(q))
      .sort((a, b) => b.date.localeCompare(a.date));
  });

  selected = computed(() => this.filtered().find(r => r.id === this.selectedId()) ?? this.filtered()[0]);

  select(id: string) { this.selectedId.set(id); }
}
