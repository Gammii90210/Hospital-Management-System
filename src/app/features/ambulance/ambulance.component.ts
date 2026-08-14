import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataStoreService } from '../../core/services/data-store.service';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-ambulance',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './ambulance.component.html',
  styleUrl: './ambulance.component.scss',
})
export class AmbulanceComponent {
  constructor(public store: DataStoreService) {}

  active = computed(() => this.store.ambulanceDispatches().filter(d => d.status !== 'Completed'));
  emergencyCount = computed(() => this.store.ambulanceDispatches().filter(d => d.type === 'Emergency').length);
  completed = computed(() => this.store.ambulanceDispatches().filter(d => d.status === 'Completed'));

  statusChip(s: string): string {
    switch (s) {
      case 'Completed': return 'chip-success';
      case 'Dispatched': return 'chip-info';
      case 'En Route': return 'chip-warning';
      case 'Arrived': return 'chip-clinical';
      default: return 'chip-neutral';
    }
  }

  typeChip(t: string): string {
    return t === 'Emergency' ? 'chip-critical' : t === 'Transfer' ? 'chip-warning' : 'chip-neutral';
  }
}
