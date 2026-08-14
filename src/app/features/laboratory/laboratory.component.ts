import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataStoreService } from '../../core/services/data-store.service';
import { IconComponent } from '../../shared/icon.component';
import { LabOrder } from '../../core/models/models';

@Component({
  selector: 'app-laboratory',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './laboratory.component.html',
  styleUrl: './laboratory.component.scss',
})
export class LaboratoryComponent {
  statusFilter = signal<'All' | LabOrder['status']>('All');

  constructor(public store: DataStoreService) {}

  filtered = computed(() => {
    const sf = this.statusFilter();
    return this.store.labOrders()
      .filter(l => sf === 'All' || l.status === sf)
      .sort((a, b) => b.orderedOn.localeCompare(a.orderedOn));
  });

  pending = computed(() => this.store.labOrders().filter(l => l.status !== 'Completed' && l.status !== 'Cancelled').length);
  statCount = computed(() => this.store.labOrders().filter(l => l.priority === 'STAT' && l.status !== 'Completed').length);
  completedToday = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    return this.store.labOrders().filter(l => l.resultDate === today).length;
  });

  statusChip(status: string): string {
    switch (status) {
      case 'Completed': return 'chip-success';
      case 'Ordered': return 'chip-info';
      case 'Sample Collected': case 'In Progress': return 'chip-warning';
      case 'Cancelled': return 'chip-critical';
      default: return 'chip-neutral';
    }
  }

  advance(order: LabOrder) {
    const flow: LabOrder['status'][] = ['Ordered', 'Sample Collected', 'In Progress', 'Completed'];
    const idx = flow.indexOf(order.status);
    if (idx >= 0 && idx < flow.length - 1) {
      this.store.updateLabStatus(order.id, flow[idx + 1]);
    }
  }
}
