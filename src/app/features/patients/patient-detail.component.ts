import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DataStoreService } from '../../core/services/data-store.service';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  templateUrl: './patient-detail.component.html',
  styleUrl: './patient-detail.component.scss',
})
export class PatientDetailComponent {
  patientId = signal('');
  activeTab = signal<'overview' | 'emr' | 'appointments' | 'billing' | 'labs'>('overview');
  showDischargeConfirm = signal(false);

  constructor(private route: ActivatedRoute, private router: Router, public store: DataStoreService) {
    this.patientId.set(this.route.snapshot.paramMap.get('id') ?? '');
  }

  openDischargeConfirm() { this.showDischargeConfirm.set(true); }
  closeDischargeConfirm() { this.showDischargeConfirm.set(false); }

  confirmDischarge() {
    this.store.dischargePatient(this.patientId());
    this.showDischargeConfirm.set(false);
    this.router.navigate(['/patients']);
  }

  patient = computed(() => this.store.patientById(this.patientId()));
  records = computed(() => this.store.emrRecords().filter(e => e.patientId === this.patientId()).sort((a, b) => b.date.localeCompare(a.date)));
  appts = computed(() => this.store.appointments().filter(a => a.patientId === this.patientId()).sort((a, b) => b.date.localeCompare(a.date)));
  invoices = computed(() => this.store.invoices().filter(i => i.patientId === this.patientId()).sort((a, b) => b.date.localeCompare(a.date)));
  labs = computed(() => this.store.labOrders().filter(l => l.patientId === this.patientId()).sort((a, b) => b.orderedOn.localeCompare(a.orderedOn)));

  age(dob: string): number {
    const diff = Date.now() - new Date(dob).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  }

  formatCurrency(n: number): string {
    return '₦' + n.toLocaleString('en-NG');
  }

  statusChip(status: string): string {
    switch (status) {
      case 'Paid': case 'Completed': return 'chip-success';
      case 'Pending': case 'Scheduled': case 'Ordered': return 'chip-info';
      case 'Overdue': case 'Cancelled': return 'chip-critical';
      default: return 'chip-warning';
    }
  }
}
