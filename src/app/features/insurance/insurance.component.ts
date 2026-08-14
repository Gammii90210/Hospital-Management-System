import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataStoreService } from '../../core/services/data-store.service';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-insurance',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './insurance.component.html',
  styleUrl: './insurance.component.scss',
})
export class InsuranceComponent {
  statusFilter = signal<'All' | string>('All');
  constructor(public store: DataStoreService) {}

  filtered = computed(() => {
    const sf = this.statusFilter();
    return this.store.claims()
      .filter(c => sf === 'All' || c.status === sf)
      .sort((a, b) => b.submittedOn.localeCompare(a.submittedOn));
  });

  totalClaimed = computed(() => this.store.claims().reduce((s, c) => s + c.amountClaimed, 0));
  totalApproved = computed(() => this.store.claims().reduce((s, c) => s + c.amountApproved, 0));
  pendingCount = computed(() => this.store.claims().filter(c => c.status === 'Under Review' || c.status === 'Submitted').length);

  formatCurrency(n: number): string { return '₦' + n.toLocaleString('en-NG'); }

  statusChip(s: string): string {
    switch (s) {
      case 'Approved': case 'Paid': return 'chip-success';
      case 'Submitted': return 'chip-neutral';
      case 'Under Review': return 'chip-info';
      case 'Rejected': return 'chip-critical';
      default: return 'chip-warning';
    }
  }
}
