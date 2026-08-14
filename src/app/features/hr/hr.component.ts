import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataStoreService } from '../../core/services/data-store.service';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-hr',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './hr.component.html',
  styleUrl: './hr.component.scss',
})
export class HrComponent {
  roleFilter = signal<'All' | string>('All');
  search = signal('');
  constructor(public store: DataStoreService) {}

  roles = computed(() => Array.from(new Set(this.store.staff().map(s => s.role))));

  filtered = computed(() => {
    const r = this.roleFilter();
    const q = this.search().toLowerCase();
    return this.store.staff()
      .filter(s => (r === 'All' || s.role === r) &&
        (!q || `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) || s.department.toLowerCase().includes(q)))
      .sort((a, b) => a.lastName.localeCompare(b.lastName));
  });

  totalPayroll = computed(() => this.store.staff().reduce((s, st) => s + st.salary, 0));
  onDuty = computed(() => this.store.staff().filter(s => s.status === 'On Duty').length);

  formatCurrency(n: number): string { return '₦' + n.toLocaleString('en-NG'); }

  statusChip(s: string): string {
    return s === 'On Duty' ? 'chip-success' : s === 'On Leave' ? 'chip-warning' : 'chip-neutral';
  }
}
