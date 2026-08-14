// Core domain models for the HMS mock backend

export type Gender = 'Male' | 'Female' | 'Other';
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface Patient {
  id: string;
  mrn: string; // medical record number
  firstName: string;
  lastName: string;
  gender: Gender;
  dob: string;
  phone: string;
  email: string;
  address: string;
  bloodGroup: BloodGroup;
  allergies: string[];
  insuranceProvider: string;
  insurancePolicyNo: string;
  registeredOn: string;
  avatarColor: string;
  status: 'Outpatient' | 'Inpatient' | 'Discharged' | 'Emergency';
}

export type AppointmentStatus = 'Scheduled' | 'Checked-in' | 'In Progress' | 'Completed' | 'Cancelled' | 'No-show';

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  department: string;
  date: string;
  time: string;
  durationMins: number;
  status: AppointmentStatus;
  reason: string;
  type: 'In-person' | 'Telemedicine';
}

export interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  role: 'Doctor' | 'Nurse' | 'Admin' | 'Pharmacist' | 'Lab Technician' | 'Radiologist' | 'Receptionist';
  department: string;
  specialty?: string;
  phone: string;
  email: string;
  shift: 'Morning' | 'Evening' | 'Night';
  status: 'On Duty' | 'Off Duty' | 'On Leave';
  joinedOn: string;
  salary: number;
  avatarColor: string;
}

export interface VitalSigns {
  date: string;
  bp: string;
  heartRate: number;
  temp: number;
  respRate: number;
  spo2: number;
  weight: number;
}

export interface EmrRecord {
  id: string;
  patientId: string;
  date: string;
  doctorId: string;
  diagnosis: string;
  notes: string;
  prescriptions: { drug: string; dosage: string; frequency: string; duration: string }[];
  vitals: VitalSigns;
  followUp?: string;
}

export type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue' | 'Partially Paid' | 'Insurance Claim';

export interface InvoiceLineItem {
  description: string;
  category: 'Consultation' | 'Lab' | 'Pharmacy' | 'Room' | 'Procedure' | 'Radiology';
  amount: number;
}

export interface Invoice {
  id: string;
  patientId: string;
  date: string;
  items: InvoiceLineItem[];
  total: number;
  amountPaid: number;
  status: InvoiceStatus;
  insuranceClaimId?: string;
}

export type BedStatus = 'Occupied' | 'Available' | 'Cleaning' | 'Maintenance';

export interface Bed {
  id: string;
  ward: string;
  roomNo: string;
  bedNo: string;
  status: BedStatus;
  patientId?: string;
  admittedOn?: string;
  expectedDischarge?: string;
}

export interface Drug {
  id: string;
  name: string;
  category: string;
  stock: number;
  reorderLevel: number;
  unit: string;
  pricePerUnit: number;
  expiryDate: string;
  supplier: string;
}

export type LabStatus = 'Ordered' | 'Sample Collected' | 'In Progress' | 'Completed' | 'Cancelled';

export interface LabOrder {
  id: string;
  patientId: string;
  testName: string;
  orderedBy: string;
  orderedOn: string;
  status: LabStatus;
  result?: string;
  resultDate?: string;
  priority: 'Routine' | 'Urgent' | 'STAT';
}

export type RadiologyStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Reported';

export interface RadiologyOrder {
  id: string;
  patientId: string;
  scanType: 'X-Ray' | 'MRI' | 'CT Scan' | 'Ultrasound';
  orderedBy: string;
  scheduledOn: string;
  status: RadiologyStatus;
  findings?: string;
}

export interface InventoryAsset {
  id: string;
  name: string;
  category: string;
  department: string;
  quantity: number;
  condition: 'New' | 'Good' | 'Needs Repair' | 'Out of Service';
  lastServiced: string;
}

export interface InsuranceClaim {
  id: string;
  patientId: string;
  invoiceId: string;
  provider: string;
  amountClaimed: number;
  amountApproved: number;
  status: 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Paid';
  submittedOn: string;
}

export interface OtBooking {
  id: string;
  patientId: string;
  surgeon: string;
  procedure: string;
  theatre: string;
  date: string;
  startTime: string;
  durationMins: number;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  team: string[];
}

export interface AmbulanceDispatch {
  id: string;
  vehicleNo: string;
  driver: string;
  type: 'Emergency' | 'Transfer' | 'Scheduled';
  pickupLocation: string;
  destination: string;
  status: 'Dispatched' | 'En Route' | 'Arrived' | 'Completed';
  requestedOn: string;
}

export interface BloodUnit {
  id: string;
  bloodGroup: BloodGroup;
  units: number;
  donorName?: string;
  collectedOn: string;
  expiryDate: string;
  status: 'Available' | 'Reserved' | 'Used' | 'Expired';
}

export interface AuditLogEntry {
  id: string;
  user: string;
  action: string;
  module: string;
  timestamp: string;
  details: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'critical' | 'success';
  timestamp: string;
  read: boolean;
}

export type UserRole = 'Administrator' | 'Doctor' | 'Nurse' | 'Receptionist' | 'Pharmacist' | 'Lab Technician';

export interface CurrentUser {
  name: string;
  role: UserRole;
  avatarColor: string;
}
