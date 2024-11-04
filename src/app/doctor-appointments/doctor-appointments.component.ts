import { Component, OnInit } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  getDoc,
} from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { Observable, of, forkJoin } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { AuthService } from '../auth-service.service'; // Assuming AuthService is used to get the logged-in user
import { CommonModule } from '@angular/common';
import { updateDoc } from 'firebase/firestore';

@Component({
  selector: 'app-doctor-appointments',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './doctor-appointments.component.html',
  styleUrls: ['./doctor-appointments.component.css'],
})
export class DoctorAppointmentsComponent implements OnInit {
  appointments$!: Observable<any[]>;

  constructor(private firestore: Firestore, private authService: AuthService) {}

  ngOnInit() {
    const appointmentsCollection = collection(this.firestore, 'appointments');
    this.appointments$ = collectionData(appointmentsCollection, {
      idField: 'id',
    }).pipe(
      switchMap((appointments: any[]) => {
        const user = this.authService.getUser(); // Get the logged-in user
        const doctorId = user?.uid; // Get the logged-in doctor's ID

        // Filter appointments for the logged-in doctor
        const filteredAppointments = appointments.filter(
          (appointment) => appointment.doctorId === doctorId
        );

        if (filteredAppointments.length === 0) {
          console.log('No appointments found for the logged-in doctor');
          return of([]); // Return empty if no appointments match
        }

        // Use forkJoin to fetch doctor and patient details
        return forkJoin(
          filteredAppointments.map(async (appointment) => {
            try {
              const patientRef = doc(
                this.firestore,
                'User',
                appointment.currentUserId
              );
              const patientSnap = await getDoc(patientRef);

              return {
                id: appointment.id, // Ensure to include the ID here
                doctorId: appointment.doctorId,
                patientName: patientSnap.data()?.['name'] || 'Unknown Patient',
                appointmentDate: appointment.date,
                appointmentTime: appointment.time,
                status: appointment.status,
              };
            } catch (error) {
              console.error('Error fetching data:', error);
              return { error: 'Failed to fetch appointment details' };
            }
          })
        );
      }),
      catchError((error) => {
        console.error('Error with appointments observable:', error);
        return of([]); // Return an empty array on error
      })
    );
  }
  async updateStatus(appointmentId: string, newStatus: string) {
    console.log('Received appointment ID:', appointmentId); // Log the ID to ensure it is not undefined
    if (!appointmentId) {
      console.error('Appointment ID is undefined or empty');
      return; // Prevent further execution if the ID is invalid
    }
    try {
      const appointmentDocRef = doc(this.firestore, `appointments/${appointmentId}`);
      await updateDoc(appointmentDocRef, { status: newStatus });
      console.log(`Appointment ${appointmentId} status updated to ${newStatus}`);
      
      // Optionally refresh the appointments list
      this.ngOnInit(); // Re-fetch appointments to reflect changes
    } catch (error) {
      console.error(`Error updating appointment status for ID ${appointmentId}:`, error);
    }
  }
  
  
 }
