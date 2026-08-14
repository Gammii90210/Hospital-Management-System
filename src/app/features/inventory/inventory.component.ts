import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataStoreService } from '../../core/services/data-store.service';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss',
})
export class InventoryComponent {
  condFilter = signal<'All' | string>('All');
  constructor(public store: DataStoreService) {}

  filtered = computed(() => {
    const f = this.condFilter();
    return this.store.inventory().filter(a => f === 'All' || a.condition === f);
  });

  needsAttention = computed(() => this.store.inventory().filter(a => a.condition === 'Needs Repair' || a.condition === 'Out of Service'));
  totalItems = computed(() => this.store.inventory().reduce((s, a) => s + a.quantity, 0));

  condChip(c: string): string {
    switch (c) {
      case 'New': return 'chip-success';
      case 'Good': return 'chip-clinical';
      case 'Needs Repair': return 'chip-warning';
      case 'Out of Service': return 'chip-critical';
      default: return 'chip-neutral';
    }
  }
}
