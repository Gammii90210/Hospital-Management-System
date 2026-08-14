import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataStoreService } from '../../core/services/data-store.service';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-telemedicine',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './telemedicine.component.html',
  styleUrl: './telemedicine.component.scss',
})
export class TelemedicineComponent {
  constructor(public store: DataStoreService) {}

  sessions = computed(() =>
    this.store.appointments()
      .filter(a => a.type === 'Telemedicine')
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
  );

  upcoming = computed(() => this.sessions().filter(s => s.status === 'Scheduled' || s.status === 'Checked-in'));
  past = computed(() => this.sessions().filter(s => s.status === 'Completed'));

  statusChip(status: string): string {
    switch (status) {
      case 'Completed': return 'chip-success';
      case 'Scheduled': case 'Checked-in': return 'chip-info';
      case 'Cancelled': case 'No-show': return 'chip-critical';
      default: return 'chip-warning';
    }
  }

  startCall(id: string) {
    this.store.updateAppointmentStatus(id, 'In Progress');
  }
}
