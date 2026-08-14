import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataStoreService } from '../../core/services/data-store.service';
import { IconComponent } from '../../shared/icon.component';
import { BloodGroup } from '../../core/models/models';

@Component({
  selector: 'app-bloodbank',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './bloodbank.component.html',
  styleUrl: './bloodbank.component.scss',
})
export class BloodbankComponent {
  constructor(public store: DataStoreService) {}

  bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  summaryByGroup = computed(() => {
    return this.bloodGroups.map(bg => {
      const units = this.store.bloodUnits().filter(u => u.bloodGroup === bg && u.status === 'Available');
      return { bg, count: units.length };
    });
  });

  available = computed(() => this.store.bloodUnits().filter(u => u.status === 'Available'));
  reserved = computed(() => this.store.bloodUnits().filter(u => u.status === 'Reserved'));

  isExpiringSoon(expiry: string): boolean {
    const days = (new Date(expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return days <= 7 && days > 0;
  }

  isExpired(expiry: string): boolean {
    return new Date(expiry) < new Date();
  }
}
