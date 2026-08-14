import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataStoreService } from '../../core/services/data-store.service';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-patient-portal',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './patient-portal.component.html',
  styleUrl: './patient-portal.component.scss',
})
export class PatientPortalComponent {
  searchQuery = signal('');
  selectedPatientId = signal<string | null>(null);

  constructor(public store: DataStoreService) {}

  searchResults = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    if (!q) return [];
    return this.store.patients().filter(p =>
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) || p.mrn.toLowerCase().includes(q)
    ).slice(0, 8);
  });

  selectedPatient = computed(() =>
    this.selectedPatientId() ? this.store.patientById(this.selectedPatientId()!) : null
  );

  patientAppointments = computed(() =>
    this.store.appointments().filter(a => a.patientId === this.selectedPatientId()).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5)
  );

  patientInvoices = computed(() =>
    this.store.invoices().filter(i => i.patientId === this.selectedPatientId()).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5)
  );

  selectPatient(id: string) {
    this.selectedPatientId.set(id);
    this.searchQuery.set('');
  }

  formatCurrency(n: number): string { return '₦' + n.toLocaleString('en-NG'); }
  age(dob: string): number {
    return Math.floor((Date.now() - new Date(dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25));
  }
}
