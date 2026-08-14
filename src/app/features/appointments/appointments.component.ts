import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataStoreService } from '../../core/services/data-store.service';
import { IconComponent } from '../../shared/icon.component';
import { Appointment } from '../../core/models/models';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.scss',
})
export class AppointmentsComponent {
  dateFilter = signal<'today' | 'upcoming' | 'all'>('today');
  statusFilter = signal<'All' | Appointment['status']>('All');
  showModal = signal(false);

  form = signal({ patientId: '', doctorId: '', department: 'General Medicine', date: '', time: '09:00', reason: '', type: 'In-person' as Appointment['type'] });

  constructor(public store: DataStoreService) {}

  doctors = computed(() => this.store.staff().filter(s => s.role === 'Doctor'));

  filtered = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    const df = this.dateFilter();
    const sf = this.statusFilter();
    return this.store.appointments()
      .filter(a => {
        if (df === 'today' && a.date !== today) return false;
        if (df === 'upcoming' && a.date < today) return false;
        if (sf !== 'All' && a.status !== sf) return false;
        return true;
      })
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  });

  statusChip(status: string): string {
    switch (status) {
      case 'Completed': return 'chip-success';
      case 'Scheduled': case 'Checked-in': return 'chip-info';
      case 'In Progress': return 'chip-warning';
      case 'Cancelled': case 'No-show': return 'chip-critical';
      default: return 'chip-neutral';
    }
  }

  setStatus(id: string, status: Appointment['status']) {
    this.store.updateAppointmentStatus(id, status);
  }

  openModal() { this.showModal.set(true); }
  closeModal() { this.showModal.set(false); }
  updateField(key: string, value: any) { this.form.update(f => ({ ...f, [key]: value })); }

  submit() {
    const f = this.form();
    if (!f.patientId || !f.doctorId || !f.date) return;
    const appt: Appointment = {
      id: `ap-${Date.now()}`,
      patientId: f.patientId,
      doctorId: f.doctorId,
      department: f.department,
      date: f.date,
      time: f.time,
      durationMins: 30,
      status: 'Scheduled',
      reason: f.reason || 'General consultation',
      type: f.type,
    };
    this.store.addAppointment(appt);
    this.form.set({ patientId: '', doctorId: '', department: 'General Medicine', date: '', time: '09:00', reason: '', type: 'In-person' });
    this.closeModal();
  }
}
