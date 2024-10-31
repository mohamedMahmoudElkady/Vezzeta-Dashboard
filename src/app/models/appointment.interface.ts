// models/appointment.interface.ts
export interface Appointment {
    id: string;
    clinic: string; // Adjust if needed
    doctorId: string; // Assuming this is a string
    patientId: string; // Assuming this is a string
    patientName: string; // Assuming this is a string
    date: Date; // Change to Date
    notes: string; // Assuming this is a string
    status: string; // Assuming this is a string
  }
  