import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataStoreService } from '../../core/services/data-store.service';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
})
export class ReportsComponent {
  constructor(public store: DataStoreService) {}

  patientsByStatus = computed(() => {
    const statuses = ['Outpatient', 'Inpatient', 'Emergency', 'Discharged'];
    const total = this.store.patients().length || 1;
    return statuses.map(s => ({
      label: s,
      count: this.store.patients().filter(p => p.status === s).length,
      pct: Math.round((this.store.patients().filter(p => p.status === s).length / total) * 100),
    }));
  });

  revenueByStatus = computed(() => {
    const statuses: string[] = ['Paid', 'Pending', 'Overdue', 'Partially Paid', 'Insurance Claim'];
    return statuses.map(s => ({
      label: s,
      amount: this.store.invoices().filter(i => i.status === s).reduce((sum, i) => sum + i.total, 0),
    }));
  });

  labSummary = computed(() => {
    const statuses = ['Ordered', 'Sample Collected', 'In Progress', 'Completed', 'Cancelled'];
    return statuses.map(s => ({ label: s, count: this.store.labOrders().filter(l => l.status === s).length }));
  });

  staffByRole = computed(() => {
    const map = new Map<string, number>();
    for (const s of this.store.staff()) { map.set(s.role, (map.get(s.role) ?? 0) + 1); }
    return Array.from(map.entries()).map(([role, count]) => ({ role, count })).sort((a, b) => b.count - a.count);
  });

  formatCurrency(n: number): string { return '₦' + n.toLocaleString('en-NG'); }

  totalRevenue = computed(() => this.store.invoices().reduce((s, i) => s + i.total, 0));
  totalCollected = computed(() => this.store.invoices().reduce((s, i) => s + i.amountPaid, 0));
  maxBar = computed(() => Math.max(...this.revenueByStatus().map(r => r.amount), 1));
}
