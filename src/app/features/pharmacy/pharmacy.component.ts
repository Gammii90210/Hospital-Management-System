import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataStoreService } from '../../core/services/data-store.service';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-pharmacy',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './pharmacy.component.html',
  styleUrl: './pharmacy.component.scss',
})
export class PharmacyComponent {
  search = signal('');
  lowStockOnly = signal(false);

  constructor(public store: DataStoreService) {}

  filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    return this.store.drugs()
      .filter(d => !q || d.name.toLowerCase().includes(q) || d.category.toLowerCase().includes(q))
      .filter(d => !this.lowStockOnly() || d.stock <= d.reorderLevel)
      .sort((a, b) => a.name.localeCompare(b.name));
  });

  totalValue = computed(() => this.store.drugs().reduce((s, d) => s + d.stock * d.pricePerUnit, 0));

  stockLevel(d: { stock: number; reorderLevel: number }): 'critical' | 'low' | 'ok' {
    if (d.stock === 0) return 'critical';
    if (d.stock <= d.reorderLevel) return 'low';
    return 'ok';
  }

  formatCurrency(n: number): string {
    return '₦' + n.toLocaleString('en-NG');
  }

  dispense(id: string) {
    this.store.dispenseDrug(id, 1);
  }
}
