import { Component, OnInit } from '@angular/core';
import { Firestore, collection, getDocs, doc, getDoc, DocumentReference, Timestamp, updateDoc } from '@angular/fire/firestore';
import { AuthService } from '../auth-service.service';
import { Observable, of } from 'rxjs';
import { Appointment } from '../models/appointment.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-doctor-appointments',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './doctor-appointments.component.html',
  styleUrls: ['./doctor-appointments.component.css']
})
export class DoctorAppointmentsComponent implements OnInit {
  appointments$: Observable<Appointment[]> | undefined;

  constructor(private firestore: Firestore, private authService: AuthService) {}

  async ngOnInit() {
    const user = this.authService.getUser();
    if (user) {
      const doctorRefPath = `doctor/${user.uid}`;

      try {
        const appointmentsCollection = collection(this.firestore, 'appointments');
        const querySnapshot = await getDocs(appointmentsCollection);

        const appointmentsWithPatients: Appointment[] = [];
        
        for (const docSnapshot of querySnapshot.docs) {
          const appointmentData = docSnapshot.data() as any;
          const doctorIdRef = (appointmentData.doctorId as DocumentReference).path;

          if (doctorIdRef === doctorRefPath) {
            const patientDocRef = doc(this.firestore, `User/${(appointmentData.patientId as DocumentReference).id}`);
            const patientDoc = await getDoc(patientDocRef);

            const patientData = patientDoc.exists() ? (patientDoc.data() as { name: string }) : { name: 'Unknown' };

            const appointmentDate = (appointmentData.date as Timestamp).toDate();

            appointmentsWithPatients.push({
              id: docSnapshot.id,
              clinic: appointmentData.clinic,
              doctorId: doctorIdRef,
              patientId: (appointmentData.patientId as DocumentReference).id,
              patientName: patientData.name,
              date: appointmentDate,
              notes: appointmentData.notes || '',
              status: appointmentData.status || ''
            });
          }
        }

        this.appointments$ = of(appointmentsWithPatients);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        this.appointments$ = of([]);
      }
    } else {
      console.error('User not authenticated');
      this.appointments$ = of([]);
    }
  }

  // Method to update the status of an appointment
  async updateStatus(appointmentId: string, newStatus: string) {
    try {
      const appointmentDocRef = doc(this.firestore, `appointments/${appointmentId}`);
      await updateDoc(appointmentDocRef, { status: newStatus });
      console.log(`Appointment ${appointmentId} status updated to ${newStatus}`);

      // Optionally, refresh the appointments list after updating
      this.ngOnInit(); // Re-fetch appointments to reflect the updated status
    } catch (error) {
      console.error(`Error updating appointment status:`, error);
    }
  }
}
