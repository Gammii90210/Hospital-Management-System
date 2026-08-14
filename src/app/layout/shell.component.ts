import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { IconComponent } from '../shared/icon.component';
import { NAV_GROUPS, NAV_ITEMS } from './nav-items';
import { DataStoreService } from '../core/services/data-store.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, IconComponent],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  navGroups = NAV_GROUPS;
  navItems = NAV_ITEMS;
  searchOpen = signal(false);
  searchQuery = signal('');
  notifOpen = signal(false);
  userMenuOpen = signal(false);

  constructor(public store: DataStoreService) {}

  itemsForGroup(group: string) {
    return this.navItems.filter(i => i.group === group);
  }

  searchResults = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    if (!q) return [];
    return this.store.patients()
      .filter(p =>
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) ||
        p.mrn.toLowerCase().includes(q) ||
        p.phone.includes(q)
      )
      .slice(0, 6);
  });

  toggleNotif() {
    this.notifOpen.set(!this.notifOpen());
    this.userMenuOpen.set(false);
  }
  toggleUserMenu() {
    this.userMenuOpen.set(!this.userMenuOpen());
    this.notifOpen.set(false);
  }

  userInitials = computed(() => { const name = this.store.currentUser().name; return name.split(" ").map((n: string) => n[0]).join("").slice(0, 2); });

  get censusOccupancy() { return this.store.bedOccupancy(); }
  get todaysApptCount() { return this.store.todaysAppointments().length; }
  get pendingLabs() { return this.store.pendingLabOrders(); }
  get lowStock() { return this.store.lowStockDrugs().length; }
}
