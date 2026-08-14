export interface NavItem {
  label: string;
  path: string;
  icon: string; // simple inline SVG path key
  group: 'Overview' | 'Clinical' | 'Operations' | 'Administration';
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: 'grid', group: 'Overview' },

  { label: 'Patients', path: '/patients', icon: 'users', group: 'Clinical' },
  { label: 'Appointments', path: '/appointments', icon: 'calendar', group: 'Clinical' },
  { label: 'EMR', path: '/emr', icon: 'file-text', group: 'Clinical' },
  { label: 'Telemedicine', path: '/telemedicine', icon: 'video', group: 'Clinical' },
  { label: 'Laboratory', path: '/laboratory', icon: 'flask', group: 'Clinical' },
  { label: 'Radiology', path: '/radiology', icon: 'scan', group: 'Clinical' },

  { label: 'Inpatient / Beds', path: '/inpatient', icon: 'bed', group: 'Operations' },
  { label: 'Operation Theatre', path: '/ot', icon: 'activity', group: 'Operations' },
  { label: 'Pharmacy', path: '/pharmacy', icon: 'pill', group: 'Operations' },
  { label: 'Blood Bank', path: '/bloodbank', icon: 'droplet', group: 'Operations' },
  { label: 'Ambulance', path: '/ambulance', icon: 'truck', group: 'Operations' },
  { label: 'Inventory', path: '/inventory', icon: 'box', group: 'Operations' },

  { label: 'Billing', path: '/billing', icon: 'receipt', group: 'Administration' },
  { label: 'Insurance', path: '/insurance', icon: 'shield', group: 'Administration' },
  { label: 'HR & Staff', path: '/hr', icon: 'id-badge', group: 'Administration' },
  { label: 'Patient Portal', path: '/patient-portal', icon: 'smartphone', group: 'Administration' },
  { label: 'Reports', path: '/reports', icon: 'bar-chart', group: 'Administration' },
  { label: 'Audit & Settings', path: '/settings', icon: 'settings', group: 'Administration' },
];

export const NAV_GROUPS: NavItem['group'][] = ['Overview', 'Clinical', 'Operations', 'Administration'];
