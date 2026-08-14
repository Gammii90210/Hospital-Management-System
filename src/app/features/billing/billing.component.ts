import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataStoreService } from '../../core/services/data-store.service';
import { IconComponent } from '../../shared/icon.component';
import { Invoice } from '../../core/models/models';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './billing.component.html',
  styleUrl: './billing.component.scss',
})
export class BillingComponent {
  statusFilter = signal<'All' | Invoice['status']>('All');
  selected = signal<Invoice | null>(null);

  constructor(public store: DataStoreService) {}

  filtered = computed(() => {
    const sf = this.statusFilter();
    return this.store.invoices()
      .filter(i => sf === 'All' || i.status === sf)
      .sort((a, b) => b.date.localeCompare(a.date));
  });

  totalRevenue = computed(() => this.store.invoices().reduce((s, i) => s + i.amountPaid, 0));
  totalOutstanding = computed(() => this.store.outstandingBalance());
  overdueCount = computed(() => this.store.invoices().filter(i => i.status === 'Overdue').length);

  formatCurrency(n: number): string {
    return '₦' + n.toLocaleString('en-NG');
  }

  statusChip(status: string): string {
    switch (status) {
      case 'Paid': return 'chip-success';
      case 'Pending': return 'chip-info';
      case 'Partially Paid': return 'chip-warning';
      case 'Overdue': return 'chip-critical';
      default: return 'chip-neutral';
    }
  }

  view(inv: Invoice) { this.selected.set(inv); }
  close() { this.selected.set(null); }

  markPaid(id: string) {
    this.store.markInvoicePaid(id);
    this.close();
  }

  revenueByCategory = computed(() => {
    const map = new Map<string, number>();
    for (const inv of this.store.invoices()) {
      for (const item of inv.items) {
        map.set(item.category, (map.get(item.category) ?? 0) + item.amount);
      }
    }
    const total = Array.from(map.values()).reduce((s, v) => s + v, 0) || 1;
    return Array.from(map.entries()).map(([cat, amt]) => ({ cat, amt, pct: Math.round((amt / total) * 100) })).sort((a, b) => b.amt - a.amt);
  });
}
