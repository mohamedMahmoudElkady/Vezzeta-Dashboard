import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  getDoc,
} from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { Observable, forkJoin, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css'],
})
export class AppointmentsComponent implements OnInit {
  appointments$!: Observable<any[]>;

  constructor(private firestore: Firestore) {}

  ngOnInit() {
    const appointmentsCollection = collection(this.firestore, 'appointments');
    this.appointments$ = collectionData(appointmentsCollection, {
      idField: 'id',
    }).pipe(
      switchMap((appointments: any[]) => {
        if (appointments.length === 0) {
          console.log('No appointments found');
          return of([]);
        }
        return forkJoin(
          appointments.map(async (appointment) => {
            try {
              if (!appointment.doctorId || !appointment.currentUserId) {
                console.warn('Missing doctorId or currentUserId for appointment ID:', appointment.id);
                return {
                  error: 'Incomplete appointment data',
                  appointmentTime: appointment.date || 'No Date',
                  time: appointment.time || 'No Time',
                };
              }

              console.log('Fetching doctor and patient for appointment ID:', appointment.id);
              const doctorRef = doc(this.firestore, 'doctor', appointment.doctorId);
              const patientRef = doc(this.firestore, 'User', appointment.currentUserId);
             
              const doctorSnap = await getDoc(doctorRef);
              const patientSnap = await getDoc(patientRef);

              return {
                doctorName: doctorSnap.data()?.['name'] || 'Unknown Doctor',
                patientName: patientSnap.data()?.['name'] || 'Unknown Patient',
                appointmentDate: appointment.date,
                appointmentTime: appointment.time,
                
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
        return of([]);
      })
    );
  }
}
