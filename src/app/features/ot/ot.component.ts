import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataStoreService } from '../../core/services/data-store.service';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-ot',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './ot.component.html',
  styleUrl: './ot.component.scss',
})
export class OtComponent {
  constructor(public store: DataStoreService) {}

  scheduled = computed(() =>
    this.store.otBookings()
      .filter(b => b.status === 'Scheduled' || b.status === 'In Progress')
      .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime))
  );

  past = computed(() =>
    this.store.otBookings()
      .filter(b => b.status === 'Completed' || b.status === 'Cancelled')
      .sort((a, b) => b.date.localeCompare(a.date))
  );

  theatreSummary = computed(() => {
    const map = new Map<string, number>();
    for (const b of this.store.otBookings()) {
      map.set(b.theatre, (map.get(b.theatre) ?? 0) + 1);
    }
    return Array.from(map.entries());
  });

  statusChip(s: string): string {
    return s === 'Completed' ? 'chip-success' : s === 'In Progress' ? 'chip-warning' : s === 'Cancelled' ? 'chip-critical' : 'chip-info';
  }
}
