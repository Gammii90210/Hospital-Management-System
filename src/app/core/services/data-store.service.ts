import { Injectable, computed, signal } from '@angular/core';
import * as gen from './mock-data.generator';
import {
  Patient, Appointment, Staff, EmrRecord, Invoice, Bed, Drug, LabOrder,
  RadiologyOrder, InventoryAsset, InsuranceClaim, OtBooking, AmbulanceDispatch,
  BloodUnit, AuditLogEntry, NotificationItem, CurrentUser
} from '../models/models';

@Injectable({ providedIn: 'root' })
export class DataStoreService {
  // ---- Current session user (role-based UI) ----
  currentUser = signal<CurrentUser>({ name: 'Dr. Amara Bello', role: 'Administrator', avatarColor: '#2563EB' });

  // ---- Seeded core collections ----
  patients = signal<Patient[]>(gen.generatePatients(80));
  staff = signal<Staff[]>(gen.generateStaff(40));
  appointments = signal<Appointment[]>([]);
  emrRecords = signal<EmrRecord[]>([]);
  invoices = signal<Invoice[]>([]);
  beds = signal<Bed[]>(gen.generateBeds());
  drugs = signal<Drug[]>(gen.generateDrugs());
  labOrders = signal<LabOrder[]>([]);
  radiologyOrders = signal<RadiologyOrder[]>([]);
  inventory = signal<InventoryAsset[]>(gen.generateInventory());
  claims = signal<InsuranceClaim[]>([]);
  otBookings = signal<OtBooking[]>([]);
  ambulanceDispatches = signal<AmbulanceDispatch[]>(gen.generateAmbulanceDispatches(12));
  bloodUnits = signal<BloodUnit[]>(gen.generateBloodBank());
  auditLog = signal<AuditLogEntry[]>([]);
  notifications = signal<NotificationItem[]>(gen.generateNotifications());

  constructor() {
    const patients = this.patients();
    const staff = this.staff();
    this.appointments.set(gen.generateAppointments(patients, staff, 60));
    this.emrRecords.set(gen.generateEmr(patients, staff, 70));
    const invoices = gen.generateInvoices(patients, 90);
    this.invoices.set(invoices);
    this.labOrders.set(gen.generateLabOrders(patients, staff, 50));
    this.radiologyOrders.set(gen.generateRadiology(patients, staff, 30));
    this.claims.set(gen.generateClaims(patients, invoices));
    this.otBookings.set(gen.generateOtBookings(patients, staff, 15));
    this.auditLog.set(gen.generateAuditLog(staff, 40));
  }

  // ---- Lookups ----
  patientName(id: string): string {
    const p = this.patients().find(p => p.id === id);
    return p ? `${p.firstName} ${p.lastName}` : 'Unknown patient';
  }
  patientById(id: string): Patient | undefined {
    return this.patients().find(p => p.id === id);
  }
  staffName(id: string): string {
    const s = this.staff().find(s => s.id === id);
    return s ? `${s.role === 'Doctor' ? 'Dr. ' : ''}${s.firstName} ${s.lastName}` : 'Unassigned';
  }
  staffById(id: string): Staff | undefined {
    return this.staff().find(s => s.id === id);
  }

  // ---- Derived / computed dashboard metrics ----
  totalPatients = computed(() => this.patients().length);
  inpatientCount = computed(() => this.patients().filter(p => p.status === 'Inpatient').length);
  bedOccupancy = computed(() => {
    const beds = this.beds();
    const occupied = beds.filter(b => b.status === 'Occupied').length;
    return { occupied, total: beds.length, pct: beds.length ? Math.round((occupied / beds.length) * 100) : 0 };
  });
  todaysAppointments = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    return this.appointments().filter(a => a.date === today);
  });
  pendingLabOrders = computed(() => this.labOrders().filter(l => l.status !== 'Completed' && l.status !== 'Cancelled').length);
  todayRevenue = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    return this.invoices().filter(i => i.date === today).reduce((s, i) => s + i.amountPaid, 0);
  });
  outstandingBalance = computed(() => this.invoices().reduce((s, i) => s + (i.total - i.amountPaid), 0));
  lowStockDrugs = computed(() => this.drugs().filter(d => d.stock <= d.reorderLevel));
  unreadNotificationCount = computed(() => this.notifications().filter(n => !n.read).length);

  // ---- Mutations ----
  addPatient(patient: Patient) {
    this.patients.update(list => [patient, ...list]);
    this.logAction('Patients', `Registered new patient ${patient.firstName} ${patient.lastName}`);
  }

  dischargePatient(id: string) {
    const patient = this.patientById(id);
    this.patients.update(list => list.filter(p => p.id !== id));
    if (patient) {
      this.logAction('Patients', `Discharged and removed patient ${patient.firstName} ${patient.lastName} (${patient.mrn})`);
    }
  }

  updateAppointmentStatus(id: string, status: Appointment['status']) {
    this.appointments.update(list => list.map(a => a.id === id ? { ...a, status } : a));
    this.logAction('Appointments', `Updated appointment ${id} status to ${status}`);
  }

  addAppointment(appt: Appointment) {
    this.appointments.update(list => [appt, ...list]);
    this.logAction('Appointments', `Scheduled new appointment for ${this.patientName(appt.patientId)}`);
  }

  markInvoicePaid(id: string) {
    this.invoices.update(list => list.map(i => i.id === id ? { ...i, status: 'Paid', amountPaid: i.total } : i));
    this.logAction('Billing', `Marked invoice ${id} as paid`);
  }

  updateBedStatus(id: string, status: Bed['status'], patientId?: string) {
    this.beds.update(list => list.map(b => b.id === id ? { ...b, status, patientId } : b));
    this.logAction('Inpatient', `Updated bed ${id} status to ${status}`);
  }

  updateLabStatus(id: string, status: LabOrder['status']) {
    this.labOrders.update(list => list.map(l => l.id === id ? { ...l, status } : l));
    this.logAction('Laboratory', `Updated lab order ${id} status to ${status}`);
  }

  dispenseDrug(id: string, qty: number) {
    this.drugs.update(list => list.map(d => d.id === id ? { ...d, stock: Math.max(0, d.stock - qty) } : d));
    this.logAction('Pharmacy', `Dispensed ${qty} units of drug ${id}`);
  }

  markNotificationRead(id: string) {
    this.notifications.update(list => list.map(n => n.id === id ? { ...n, read: true } : n));
  }

  logAction(module: string, details: string) {
    const user = this.currentUser();
    this.auditLog.update(list => [{
      id: `log-${Date.now()}`,
      user: user.name,
      action: details,
      module,
      timestamp: new Date().toLocaleString(),
      details,
    }, ...list]);
  }
}
