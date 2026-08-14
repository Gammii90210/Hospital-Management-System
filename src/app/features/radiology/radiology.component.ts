import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataStoreService } from '../../core/services/data-store.service';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-radiology',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './radiology.component.html',
  styleUrl: './radiology.component.scss',
})
export class RadiologyComponent {
  scanFilter = signal<'All' | 'X-Ray' | 'MRI' | 'CT Scan' | 'Ultrasound'>('All');

  constructor(public store: DataStoreService) {}

  filtered = computed(() => {
    const sf = this.scanFilter();
    return this.store.radiologyOrders()
      .filter(r => sf === 'All' || r.scanType === sf)
      .sort((a, b) => b.scheduledOn.localeCompare(a.scheduledOn));
  });

  byType = computed(() => {
    const counts = new Map<string, number>();
    for (const r of this.store.radiologyOrders()) {
      counts.set(r.scanType, (counts.get(r.scanType) ?? 0) + 1);
    }
    return Array.from(counts.entries());
  });

  statusChip(status: string): string {
    switch (status) {
      case 'Reported': return 'chip-success';
      case 'Completed': return 'chip-info';
      case 'In Progress': return 'chip-warning';
      default: return 'chip-neutral';
    }
  }
}
