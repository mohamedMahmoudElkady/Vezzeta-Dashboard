import { Component, OnInit } from '@angular/core';
import { Firestore, collection, getDocs, doc, getDoc, DocumentReference } from '@angular/fire/firestore';
import { AuthService } from '../auth-service.service';
import { Observable, of } from 'rxjs';
import { Appointment } from '../models/appointment.interface'; // Ensure the Appointment model is correctly defined
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
      const specificDoc = user.uid; // Get current user ID
      console.log('Current User ID:', specificDoc); // Log user ID

      const appointmentsCollection = collection(this.firestore, 'appointments');
      try {
        // Fetch all appointments
        const querySnapshot = await getDocs(appointmentsCollection);
        
        // Fetch patient names for appointments
        const appointmentsWithPatients: Appointment[] = [];
        for (const docSnapshot of querySnapshot.docs) {
          const appointmentData = docSnapshot.data() as any; // Explicitly type data as 'any'

          // Ensure doctorId is a DocumentReference and compare correctly
          const doctorId = (appointmentData.doctorId as DocumentReference)?.id || appointmentData.doctorId; // Fallback in case it's already a string

          if (doctorId === `doctor/${specificDoc}`) {
            const patientDocRef = doc(this.firestore, `User/${(appointmentData.patientId as DocumentReference).id}`);
            const patientDoc = await getDoc(patientDocRef);

            // Check if the patient document exists and type the data correctly
            const patientData = patientDoc.exists() ? (patientDoc.data() as { name: string }) : { name: 'Unknown' };

            appointmentsWithPatients.push({
              id: docSnapshot.id,
              clinic: appointmentData.clinic,
              doctorId: doctorId, // Use the string id
              patientId: (appointmentData.patientId as DocumentReference).id, // Accessing the id of the reference directly
              patientName: patientData.name, // Use the name from the patient data
              date: appointmentData.date,
              notes: appointmentData.notes || '',
              status: appointmentData.status || ''
            });
          }
        }

        console.log('Filtered Appointments with Patient Names:', appointmentsWithPatients); // Log appointments with patient names
        this.appointments$ = of(appointmentsWithPatients); // Assign to appointments$ for the template
      } catch (error) {
        console.error('Error fetching appointments:', error);
        this.appointments$ = of([]); // Handle errors gracefully
      }
    } else {
      console.error('User not authenticated');
      this.appointments$ = of([]); // Handle unauthenticated users
    }
  }
}
