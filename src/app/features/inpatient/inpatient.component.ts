import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataStoreService } from '../../core/services/data-store.service';
import { IconComponent } from '../../shared/icon.component';
import { Bed } from '../../core/models/models';

@Component({
  selector: 'app-inpatient',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './inpatient.component.html',
  styleUrl: './inpatient.component.scss',
})
export class InpatientComponent {
  wardFilter = signal<string>('All');
  selectedBed = signal<Bed | null>(null);

  constructor(public store: DataStoreService) {}

  wards = computed(() => Array.from(new Set(this.store.beds().map(b => b.ward))));

  filteredBeds = computed(() => {
    const w = this.wardFilter();
    return this.store.beds().filter(b => w === 'All' || b.ward === w);
  });

  bedsByWard = computed(() => {
    const map = new Map<string, Bed[]>();
    for (const b of this.filteredBeds()) {
      if (!map.has(b.ward)) map.set(b.ward, []);
      map.get(b.ward)!.push(b);
    }
    return Array.from(map.entries());
  });

  summary = computed(() => {
    const beds = this.store.beds();
    return {
      occupied: beds.filter(b => b.status === 'Occupied').length,
      available: beds.filter(b => b.status === 'Available').length,
      cleaning: beds.filter(b => b.status === 'Cleaning').length,
      maintenance: beds.filter(b => b.status === 'Maintenance').length,
    };
  });

  statusColor(status: Bed['status']): string {
    switch (status) {
      case 'Occupied': return 'bed-occupied';
      case 'Available': return 'bed-available';
      case 'Cleaning': return 'bed-cleaning';
      default: return 'bed-maintenance';
    }
  }

  selectBed(bed: Bed) {
    this.selectedBed.set(bed);
  }
  closePanel() {
    this.selectedBed.set(null);
  }

  dischargeBed(bed: Bed) {
    this.store.updateBedStatus(bed.id, 'Cleaning', undefined);
    this.closePanel();
  }

  markAvailable(bed: Bed) {
    this.store.updateBedStatus(bed.id, 'Available', undefined);
    this.closePanel();
  }
}
