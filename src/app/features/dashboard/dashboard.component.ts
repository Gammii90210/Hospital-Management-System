import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataStoreService } from '../../core/services/data-store.service';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  constructor(public store: DataStoreService) {}

  recentAppointments = computed(() =>
    [...this.store.todaysAppointments()]
      .sort((a, b) => a.time.localeCompare(b.time))
      .slice(0, 6)
  );

  recentAdmissions = computed(() =>
    this.store.beds().filter(b => b.status === 'Occupied').slice(0, 5)
  );

  criticalLabs = computed(() =>
    this.store.labOrders().filter(l => l.priority === 'STAT' && l.status !== 'Completed').slice(0, 5)
  );

  departmentLoad = computed(() => {
    const counts = new Map<string, number>();
    for (const a of this.store.appointments()) {
      counts.set(a.department, (counts.get(a.department) ?? 0) + 1);
    }
    const max = Math.max(1, ...counts.values());
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([dept, count]) => ({ dept, count, pct: Math.round((count / max) * 100) }));
  });

  weeklyRevenue = computed(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const invoices = this.store.invoices();
    const seedVals = [320000, 410000, 280000, 510000, 460000, 190000, 240000];
    const max = Math.max(...seedVals);
    return days.map((d, i) => ({ day: d, amount: seedVals[i], pct: Math.round((seedVals[i] / max) * 100) }));
  });

  formatCurrency(n: number): string {
    return '₦' + n.toLocaleString('en-NG');
  }

  statusChipClass(status: string): string {
    switch (status) {
      case 'Completed': case 'Paid': case 'Available': return 'chip-success';
      case 'Scheduled': case 'Checked-in': return 'chip-info';
      case 'Cancelled': case 'No-show': case 'Overdue': return 'chip-critical';
      case 'In Progress': return 'chip-warning';
      default: return 'chip-neutral';
    }
  }
}
