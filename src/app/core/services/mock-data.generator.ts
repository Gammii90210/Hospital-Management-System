import {
  Patient, Appointment, Staff, EmrRecord, Invoice, Bed, Drug, LabOrder,
  RadiologyOrder, InventoryAsset, InsuranceClaim, OtBooking, AmbulanceDispatch,
  BloodUnit, AuditLogEntry, NotificationItem, BloodGroup, Gender
} from '../models/models';

const FIRST_NAMES = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Chinedu', 'Amaka', 'Tunde', 'Ngozi', 'Bola', 'Femi', 'Aisha', 'Yusuf', 'Grace', 'Daniel', 'Ruth', 'Samuel', 'Esther', 'Peter'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Okafor', 'Adeyemi', 'Bello', 'Eze', 'Mohammed', 'Ibrahim', 'Okonkwo', 'Abubakar', 'Nwosu', 'Yusuf', 'Adamu', 'Chukwu'];
const DEPARTMENTS = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Medicine', 'Emergency', 'Oncology', 'Dermatology', 'ENT', 'Gynecology'];
const COLORS = ['#2563EB', '#0D9488', '#D97706', '#7C3AED', '#DB2777', '#0891B2', '#65A30D', '#DC2626'];
const DRUG_NAMES = ['Paracetamol', 'Amoxicillin', 'Ibuprofen', 'Metformin', 'Amlodipine', 'Omeprazole', 'Atorvastatin', 'Ciprofloxacin', 'Cetirizine', 'Insulin Glargine', 'Salbutamol', 'Losartan', 'Azithromycin', 'Diclofenac', 'Metronidazole'];
const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

let seed = 42;
function rand(): number {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
}
function pick<T>(arr: T[]): T { return arr[Math.floor(rand() * arr.length)]; }
function randInt(min: number, max: number): number { return Math.floor(rand() * (max - min + 1)) + min; }
function pad(n: number, len = 4): string { return n.toString().padStart(len, '0'); }
function daysFromNow(d: number): string {
  const dt = new Date();
  dt.setDate(dt.getDate() + d);
  return dt.toISOString().split('T')[0];
}

export function generatePatients(count: number): Patient[] {
  const patients: Patient[] = [];
  for (let i = 1; i <= count; i++) {
    const fn = pick(FIRST_NAMES);
    const ln = pick(LAST_NAMES);
    const statuses: Patient['status'][] = ['Outpatient', 'Outpatient', 'Outpatient', 'Inpatient', 'Discharged', 'Emergency'];
    patients.push({
      id: `pt-${i}`,
      mrn: `MRN-${pad(i, 5)}`,
      firstName: fn,
      lastName: ln,
      gender: pick<Gender>(['Male', 'Female']),
      dob: `${randInt(1950, 2020)}-${pad(randInt(1, 12), 2)}-${pad(randInt(1, 28), 2)}`,
      phone: `+234 8${randInt(10, 99)} ${randInt(100, 999)} ${randInt(1000, 9999)}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@mail.com`,
      address: `${randInt(1, 200)} ${pick(['Independence', 'Aminu Kano', 'Ahmadu Bello', 'Constitution', 'Gwarinpa'])} ${pick(['Ave', 'Crescent', 'Way', 'Close'])}, Abuja`,
      bloodGroup: pick(BLOOD_GROUPS),
      allergies: rand() > 0.7 ? [pick(['Penicillin', 'Latex', 'Peanuts', 'Sulfa drugs', 'Aspirin'])] : [],
      insuranceProvider: pick(['NHIS', 'AXA Mansard', 'Hygeia HMO', 'Reliance HMO', 'Self-pay']),
      insurancePolicyNo: rand() > 0.15 ? `POL-${randInt(100000, 999999)}` : '',
      registeredOn: daysFromNow(-randInt(1, 900)),
      avatarColor: pick(COLORS),
      status: pick(statuses),
    });
  }
  return patients;
}

export function generateStaff(count: number): Staff[] {
  const staff: Staff[] = [];
  const roles: Staff['role'][] = ['Doctor', 'Doctor', 'Doctor', 'Nurse', 'Nurse', 'Admin', 'Pharmacist', 'Lab Technician', 'Radiologist', 'Receptionist'];
  for (let i = 1; i <= count; i++) {
    const role = pick(roles);
    staff.push({
      id: `st-${i}`,
      firstName: pick(FIRST_NAMES),
      lastName: pick(LAST_NAMES),
      role,
      department: pick(DEPARTMENTS),
      specialty: role === 'Doctor' ? pick(['Cardiologist', 'Neurologist', 'Pediatrician', 'General Practitioner', 'Surgeon', 'Oncologist']) : undefined,
      phone: `+234 8${randInt(10, 99)} ${randInt(100, 999)} ${randInt(1000, 9999)}`,
      email: `staff${i}@brightcare.hospital`,
      shift: pick(['Morning', 'Evening', 'Night']),
      status: pick(['On Duty', 'On Duty', 'Off Duty', 'On Leave']),
      joinedOn: daysFromNow(-randInt(30, 2000)),
      salary: randInt(150000, 1200000),
      avatarColor: pick(COLORS),
    });
  }
  return staff;
}

export function generateAppointments(patients: Patient[], staff: Staff[], count: number): Appointment[] {
  const doctors = staff.filter(s => s.role === 'Doctor');
  const statuses: Appointment['status'][] = ['Scheduled', 'Checked-in', 'In Progress', 'Completed', 'Completed', 'Cancelled', 'No-show'];
  const appts: Appointment[] = [];
  for (let i = 1; i <= count; i++) {
    const dayOffset = randInt(-10, 14);
    appts.push({
      id: `ap-${i}`,
      patientId: pick(patients).id,
      doctorId: pick(doctors).id,
      department: pick(DEPARTMENTS),
      date: daysFromNow(dayOffset),
      time: `${pad(randInt(8, 17), 2)}:${pick(['00', '15', '30', '45'])}`,
      durationMins: pick([15, 30, 45, 60]),
      status: dayOffset < 0 ? pick(['Completed', 'Completed', 'No-show', 'Cancelled']) : pick(statuses),
      reason: pick(['Routine checkup', 'Follow-up visit', 'New symptoms', 'Lab review', 'Prescription renewal', 'Vaccination', 'Consultation']),
      type: rand() > 0.8 ? 'Telemedicine' : 'In-person',
    });
  }
  return appts;
}

export function generateEmr(patients: Patient[], staff: Staff[], count: number): EmrRecord[] {
  const doctors = staff.filter(s => s.role === 'Doctor');
  const diagnoses = ['Hypertension', 'Type 2 Diabetes', 'Acute Bronchitis', 'Malaria', 'Migraine', 'Gastroenteritis', 'Asthma', 'Lower Back Pain', 'Urinary Tract Infection', 'Anxiety Disorder'];
  const records: EmrRecord[] = [];
  for (let i = 1; i <= count; i++) {
    records.push({
      id: `emr-${i}`,
      patientId: pick(patients).id,
      date: daysFromNow(-randInt(0, 400)),
      doctorId: pick(doctors).id,
      diagnosis: pick(diagnoses),
      notes: pick([
        'Patient presented with mild symptoms, vitals stable. Advised rest and follow-up in 2 weeks.',
        'Chronic condition under management, responding well to current treatment plan.',
        'Acute presentation, prescribed medication course, advised to return if symptoms worsen.',
        'Routine review, no new concerns raised. Continue current regimen.',
      ]),
      prescriptions: Array.from({ length: randInt(1, 3) }, () => ({
        drug: pick(DRUG_NAMES),
        dosage: pick(['500mg', '250mg', '10mg', '5mg', '1 tablet']),
        frequency: pick(['Once daily', 'Twice daily', 'Three times daily', 'As needed']),
        duration: pick(['5 days', '7 days', '14 days', '30 days', 'Ongoing']),
      })),
      vitals: {
        date: daysFromNow(-randInt(0, 400)),
        bp: `${randInt(100, 140)}/${randInt(60, 90)}`,
        heartRate: randInt(60, 100),
        temp: +(36 + rand() * 2).toFixed(1),
        respRate: randInt(12, 20),
        spo2: randInt(94, 100),
        weight: randInt(45, 95),
      },
      followUp: rand() > 0.5 ? daysFromNow(randInt(7, 60)) : undefined,
    });
  }
  return records;
}

export function generateInvoices(patients: Patient[], count: number): Invoice[] {
  const statuses: Invoice['status'][] = ['Paid', 'Pending', 'Overdue', 'Partially Paid', 'Insurance Claim'];
  const invoices: Invoice[] = [];
  for (let i = 1; i <= count; i++) {
    const itemCount = randInt(1, 4);
    const items = Array.from({ length: itemCount }, () => {
      const category = pick<'Consultation' | 'Lab' | 'Pharmacy' | 'Room' | 'Procedure' | 'Radiology'>(['Consultation', 'Lab', 'Pharmacy', 'Room', 'Procedure', 'Radiology']);
      const amounts: Record<string, [number, number]> = {
        Consultation: [5000, 20000], Lab: [3000, 25000], Pharmacy: [1000, 15000],
        Room: [10000, 80000], Procedure: [20000, 250000], Radiology: [8000, 60000],
      };
      const [min, max] = amounts[category];
      return { description: `${category} service`, category, amount: randInt(min, max) };
    });
    const total = items.reduce((s, i) => s + i.amount, 0);
    const status = pick(statuses);
    const amountPaid = status === 'Paid' ? total : status === 'Partially Paid' ? Math.round(total * 0.4) : 0;
    invoices.push({
      id: `inv-${pad(i, 5)}`,
      patientId: pick(patients).id,
      date: daysFromNow(-randInt(0, 180)),
      items,
      total,
      amountPaid,
      status,
      insuranceClaimId: status === 'Insurance Claim' ? `clm-${randInt(1000, 9999)}` : undefined,
    });
  }
  return invoices;
}

export function generateBeds(): Bed[] {
  const wards = ['General Ward A', 'General Ward B', 'ICU', 'Maternity', 'Pediatric Ward', 'Surgical Ward'];
  const beds: Bed[] = [];
  let id = 1;
  for (const ward of wards) {
    const roomCount = ward === 'ICU' ? 8 : 15;
    for (let r = 1; r <= roomCount; r++) {
      const bedsPerRoom = ward === 'ICU' ? 1 : 2;
      for (let b = 1; b <= bedsPerRoom; b++) {
        const statusRoll = rand();
        const status: Bed['status'] = statusRoll > 0.55 ? 'Occupied' : statusRoll > 0.45 ? 'Cleaning' : statusRoll > 0.4 ? 'Maintenance' : 'Available';
        beds.push({
          id: `bed-${id}`,
          ward,
          roomNo: `${ward.includes('ICU') ? 'ICU' : ward[0]}-${pad(r, 2)}`,
          bedNo: `Bed ${b}`,
          status,
          patientId: status === 'Occupied' ? `pt-${randInt(1, 80)}` : undefined,
          admittedOn: status === 'Occupied' ? daysFromNow(-randInt(0, 10)) : undefined,
          expectedDischarge: status === 'Occupied' ? daysFromNow(randInt(1, 7)) : undefined,
        });
        id++;
      }
    }
  }
  return beds;
}

export function generateDrugs(): Drug[] {
  return DRUG_NAMES.map((name, i) => {
    const stock = randInt(5, 500);
    const reorder = randInt(50, 100);
    return {
      id: `drug-${i + 1}`,
      name,
      category: pick(['Analgesic', 'Antibiotic', 'Antidiabetic', 'Antihypertensive', 'Antihistamine', 'Respiratory']),
      stock,
      reorderLevel: reorder,
      unit: pick(['tablets', 'capsules', 'vials', 'bottles', 'tubes']),
      pricePerUnit: randInt(50, 5000),
      expiryDate: daysFromNow(randInt(30, 700)),
      supplier: pick(['MedPlus Distributors', 'PharmaCare Ltd', 'Global Health Supplies', 'Emzor Pharmaceuticals']),
    };
  });
}

export function generateLabOrders(patients: Patient[], staff: Staff[], count: number): LabOrder[] {
  const doctors = staff.filter(s => s.role === 'Doctor');
  const tests = ['Complete Blood Count', 'Lipid Panel', 'Liver Function Test', 'Kidney Function Test', 'Thyroid Panel', 'Urinalysis', 'Blood Glucose', 'Malaria Parasite Test', 'HbA1c', 'COVID-19 PCR'];
  const statuses: LabOrder['status'][] = ['Ordered', 'Sample Collected', 'In Progress', 'Completed', 'Completed', 'Cancelled'];
  return Array.from({ length: count }, (_, i) => {
    const status = pick(statuses);
    return {
      id: `lab-${i + 1}`,
      patientId: pick(patients).id,
      testName: pick(tests),
      orderedBy: pick(doctors).id,
      orderedOn: daysFromNow(-randInt(0, 30)),
      status,
      result: status === 'Completed' ? pick(['Normal', 'Abnormal - see notes', 'Within reference range', 'Elevated levels detected']) : undefined,
      resultDate: status === 'Completed' ? daysFromNow(-randInt(0, 25)) : undefined,
      priority: pick(['Routine', 'Routine', 'Urgent', 'STAT']),
    };
  });
}

export function generateRadiology(patients: Patient[], staff: Staff[], count: number): RadiologyOrder[] {
  const doctors = staff.filter(s => s.role === 'Doctor');
  const statuses: RadiologyOrder['status'][] = ['Scheduled', 'In Progress', 'Completed', 'Reported'];
  return Array.from({ length: count }, (_, i) => {
    const status = pick(statuses);
    return {
      id: `rad-${i + 1}`,
      patientId: pick(patients).id,
      scanType: pick(['X-Ray', 'MRI', 'CT Scan', 'Ultrasound']),
      orderedBy: pick(doctors).id,
      scheduledOn: daysFromNow(randInt(-10, 10)),
      status,
      findings: status === 'Reported' ? pick(['No abnormalities detected', 'Mild inflammation noted', 'Further evaluation recommended', 'Consistent with clinical diagnosis']) : undefined,
    };
  });
}

export function generateInventory(): InventoryAsset[] {
  const items = ['ECG Machine', 'Defibrillator', 'Ventilator', 'Patient Monitor', 'Infusion Pump', 'Wheelchair', 'Hospital Bed', 'Ultrasound Machine', 'X-Ray Machine', 'Autoclave Sterilizer', 'Oxygen Concentrator', 'Surgical Light'];
  return items.map((name, i) => ({
    id: `asset-${i + 1}`,
    name,
    category: pick(['Diagnostic', 'Life Support', 'Mobility', 'Surgical', 'Sterilization']),
    department: pick(DEPARTMENTS),
    quantity: randInt(1, 15),
    condition: pick(['New', 'Good', 'Good', 'Needs Repair', 'Out of Service']),
    lastServiced: daysFromNow(-randInt(10, 365)),
  }));
}

export function generateClaims(patients: Patient[], invoices: Invoice[]): InsuranceClaim[] {
  const insuranceInvoices = invoices.filter(i => i.status === 'Insurance Claim');
  return insuranceInvoices.map((inv, i) => ({
    id: `clm-${pad(i + 1, 4)}`,
    patientId: inv.patientId,
    invoiceId: inv.id,
    provider: pick(['NHIS', 'AXA Mansard', 'Hygeia HMO', 'Reliance HMO']),
    amountClaimed: inv.total,
    amountApproved: pick([inv.total, Math.round(inv.total * 0.8), 0]),
    status: pick(['Submitted', 'Under Review', 'Approved', 'Rejected', 'Paid']),
    submittedOn: daysFromNow(-randInt(1, 60)),
  }));
}

export function generateOtBookings(patients: Patient[], staff: Staff[], count: number): OtBooking[] {
  const surgeons = staff.filter(s => s.role === 'Doctor');
  const procedures = ['Appendectomy', 'Cesarean Section', 'Hernia Repair', 'Cataract Surgery', 'Knee Arthroscopy', 'Tonsillectomy', 'Coronary Bypass', 'Gallbladder Removal'];
  return Array.from({ length: count }, (_, i) => ({
    id: `ot-${i + 1}`,
    patientId: pick(patients).id,
    surgeon: pick(surgeons).id,
    procedure: pick(procedures),
    theatre: pick(['Theatre 1', 'Theatre 2', 'Theatre 3']),
    date: daysFromNow(randInt(-5, 14)),
    startTime: `${pad(randInt(7, 16), 2)}:00`,
    durationMins: pick([60, 90, 120, 180, 240]),
    status: pick(['Scheduled', 'Scheduled', 'In Progress', 'Completed', 'Cancelled']),
    team: Array.from({ length: randInt(2, 4) }, () => pick(staff).id),
  }));
}

export function generateAmbulanceDispatches(count: number): AmbulanceDispatch[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `amb-${i + 1}`,
    vehicleNo: `HMS-AMB-${randInt(10, 99)}`,
    driver: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
    type: pick(['Emergency', 'Transfer', 'Scheduled']),
    pickupLocation: pick(['Garki District', 'Wuse II', 'Maitama', 'Asokoro', 'Gwarinpa', 'Jabi']) + ', Abuja',
    destination: 'BrightCare General Hospital',
    status: pick(['Dispatched', 'En Route', 'Arrived', 'Completed']),
    requestedOn: daysFromNow(-randInt(0, 3)),
  }));
}

export function generateBloodBank(): BloodUnit[] {
  const units: BloodUnit[] = [];
  let id = 1;
  for (const bg of BLOOD_GROUPS) {
    const count = randInt(2, 12);
    for (let i = 0; i < count; i++) {
      units.push({
        id: `blood-${id}`,
        bloodGroup: bg,
        units: 1,
        donorName: rand() > 0.3 ? `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}` : undefined,
        collectedOn: daysFromNow(-randInt(1, 40)),
        expiryDate: daysFromNow(randInt(1, 42)),
        status: pick(['Available', 'Available', 'Reserved', 'Used']),
      });
      id++;
    }
  }
  return units;
}

export function generateAuditLog(staff: Staff[], count: number): AuditLogEntry[] {
  const actions = ['Updated patient record', 'Created invoice', 'Discharged patient', 'Modified prescription', 'Approved insurance claim', 'Logged in', 'Updated inventory count', 'Cancelled appointment'];
  return Array.from({ length: count }, (_, i) => {
    const s = pick(staff);
    return {
      id: `log-${i + 1}`,
      user: `${s.firstName} ${s.lastName}`,
      action: pick(actions),
      module: pick(['Patients', 'Billing', 'Inpatient', 'Pharmacy', 'EMR', 'Insurance', 'Auth']),
      timestamp: daysFromNow(-randInt(0, 14)) + ` ${pad(randInt(0, 23), 2)}:${pad(randInt(0, 59), 2)}`,
      details: 'System recorded action for compliance audit trail.',
    };
  });
}

export function generateNotifications(): NotificationItem[] {
  return [
    { id: 'n1', title: 'Low stock alert', message: 'Amoxicillin stock has fallen below reorder level.', type: 'warning', timestamp: '08:12 AM', read: false },
    { id: 'n2', title: 'Critical lab result', message: 'STAT blood glucose result ready for patient MRN-00042.', type: 'critical', timestamp: '07:50 AM', read: false },
    { id: 'n3', title: 'Bed available', message: 'ICU bed I-03 is now available for assignment.', type: 'success', timestamp: '07:30 AM', read: false },
    { id: 'n4', title: 'Insurance claim approved', message: 'NHIS approved claim clm-1042 for ₦84,000.', type: 'success', timestamp: 'Yesterday', read: true },
    { id: 'n5', title: 'Equipment maintenance due', message: 'Ventilator #4 is due for scheduled servicing.', type: 'info', timestamp: 'Yesterday', read: true },
  ];
}
