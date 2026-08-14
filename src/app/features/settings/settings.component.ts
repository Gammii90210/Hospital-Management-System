import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataStoreService } from '../../core/services/data-store.service';
import { IconComponent } from '../../shared/icon.component';
import { UserRole } from '../../core/models/models';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  activeTab = signal<'audit' | 'roles' | 'profile'>('audit');

  roles: UserRole[] = ['Administrator', 'Doctor', 'Nurse', 'Receptionist', 'Pharmacist', 'Lab Technician'];

  constructor(public store: DataStoreService) {}

  userInitials = computed(() => {
    const name = this.store.currentUser().name;
    return name.split(" ").map((n: string) => n[0]).join("").slice(0, 2);
  });

  changeRole(role: UserRole) {
    const current = this.store.currentUser();
    const names: Record<UserRole, string> = {
      'Administrator': 'Dr. Amara Bello',
      'Doctor': 'Dr. Chukwuemeka Okonkwo',
      'Nurse': 'Nurse Fatima Yusuf',
      'Receptionist': 'Tunde Adeyemi',
      'Pharmacist': 'Ngozi Eze',
      'Lab Technician': 'Samuel Ibrahim',
    };
    this.store.currentUser.set({ ...current, role, name: names[role] });
    this.store.logAction('Auth', `Switched session role to ${role}`);
  }

  moduleChip(m: string): string {
    switch (m) {
      case 'Billing': return 'chip-warning';
      case 'Patients': return 'chip-info';
      case 'Auth': return 'chip-critical';
      case 'Pharmacy': return 'chip-clinical';
      default: return 'chip-neutral';
    }
  }
}
