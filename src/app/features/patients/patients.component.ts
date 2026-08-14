import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataStoreService } from '../../core/services/data-store.service';
import { IconComponent } from '../../shared/icon.component';
import { Patient, Gender, BloodGroup } from '../../core/models/models';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.scss',
})
export class PatientsComponent {
  search = signal('');
  statusFilter = signal<'All' | Patient['status']>('All');
  showModal = signal(false);
  formError = signal('');

  form = signal({
    firstName: '', lastName: '', gender: 'Male' as Gender, dob: '', phone: '', email: '',
    address: '', bloodGroup: 'O+' as BloodGroup, insuranceProvider: 'Self-pay', insurancePolicyNo: '',
  });

  constructor(public store: DataStoreService) {}

  filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    const status = this.statusFilter();
    return this.store.patients().filter(p => {
      const matchesQ = !q || `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) || p.mrn.toLowerCase().includes(q) || p.phone.includes(q);
      const matchesStatus = status === 'All' || p.status === status;
      return matchesQ && matchesStatus;
    });
  });

  statusChip(status: string): string {
    switch (status) {
      case 'Inpatient': return 'chip-warning';
      case 'Emergency': return 'chip-critical';
      case 'Discharged': return 'chip-neutral';
      default: return 'chip-success';
    }
  }

  age(dob: string): number {
    const diff = Date.now() - new Date(dob).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  }

  openModal() { this.formError.set(''); this.showModal.set(true); }
  closeModal() { this.showModal.set(false); }

  updateField<K extends keyof ReturnType<typeof this.form>>(key: K, value: any) {
    this.form.update(f => ({ ...f, [key]: value }));
  }

  submit() {
    const f = this.form();
    if (!f.firstName.trim() || !f.lastName.trim() || !f.phone.trim()) {
      this.formError.set('First name, last name, and phone are required.');
      return;
    }
    this.formError.set('');
    const id = `pt-${Date.now()}`;
    const newPatient: Patient = {
      id,
      mrn: `MRN-${(this.store.patients().length + 1).toString().padStart(5, '0')}`,
      firstName: f.firstName,
      lastName: f.lastName,
      gender: f.gender,
      dob: f.dob || '1990-01-01',
      phone: f.phone,
      email: f.email,
      address: f.address,
      bloodGroup: f.bloodGroup,
      allergies: [],
      insuranceProvider: f.insuranceProvider,
      insurancePolicyNo: f.insurancePolicyNo,
      registeredOn: new Date().toISOString().split('T')[0],
      avatarColor: ['#2563EB', '#0D9488', '#D97706', '#7C3AED', '#DB2777'][Math.floor(Math.random() * 5)],
      status: 'Outpatient',
    };
    this.store.addPatient(newPatient);
    this.form.set({ firstName: '', lastName: '', gender: 'Male', dob: '', phone: '', email: '', address: '', bloodGroup: 'O+', insuranceProvider: 'Self-pay', insurancePolicyNo: '' });
    // Make sure the newly registered patient is actually visible: clear any
    // search/status filter that would otherwise hide a fresh "Outpatient" record.
    this.search.set('');
    this.statusFilter.set('All');
    this.closeModal();
  }
}
