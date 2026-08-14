import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'patients', loadComponent: () => import('./features/patients/patients.component').then(m => m.PatientsComponent) },
      { path: 'patients/:id', loadComponent: () => import('./features/patients/patient-detail.component').then(m => m.PatientDetailComponent) },
      { path: 'appointments', loadComponent: () => import('./features/appointments/appointments.component').then(m => m.AppointmentsComponent) },
      { path: 'emr', loadComponent: () => import('./features/emr/emr.component').then(m => m.EmrComponent) },
      { path: 'telemedicine', loadComponent: () => import('./features/telemedicine/telemedicine.component').then(m => m.TelemedicineComponent) },
      { path: 'laboratory', loadComponent: () => import('./features/laboratory/laboratory.component').then(m => m.LaboratoryComponent) },
      { path: 'radiology', loadComponent: () => import('./features/radiology/radiology.component').then(m => m.RadiologyComponent) },
      { path: 'inpatient', loadComponent: () => import('./features/inpatient/inpatient.component').then(m => m.InpatientComponent) },
      { path: 'ot', loadComponent: () => import('./features/ot/ot.component').then(m => m.OtComponent) },
      { path: 'pharmacy', loadComponent: () => import('./features/pharmacy/pharmacy.component').then(m => m.PharmacyComponent) },
      { path: 'bloodbank', loadComponent: () => import('./features/bloodbank/bloodbank.component').then(m => m.BloodbankComponent) },
      { path: 'ambulance', loadComponent: () => import('./features/ambulance/ambulance.component').then(m => m.AmbulanceComponent) },
      { path: 'inventory', loadComponent: () => import('./features/inventory/inventory.component').then(m => m.InventoryComponent) },
      { path: 'billing', loadComponent: () => import('./features/billing/billing.component').then(m => m.BillingComponent) },
      { path: 'insurance', loadComponent: () => import('./features/insurance/insurance.component').then(m => m.InsuranceComponent) },
      { path: 'hr', loadComponent: () => import('./features/hr/hr.component').then(m => m.HrComponent) },
      { path: 'patient-portal', loadComponent: () => import('./features/patient-portal/patient-portal.component').then(m => m.PatientPortalComponent) },
      { path: 'reports', loadComponent: () => import('./features/reports/reports.component').then(m => m.ReportsComponent) },
      { path: 'settings', loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent) },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
