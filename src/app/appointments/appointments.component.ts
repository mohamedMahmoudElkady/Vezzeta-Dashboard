import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Firestore, collection, collectionData, doc, getDoc } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit {
  appointments$!: Observable<any[]>;

  constructor(private firestore: Firestore) {}

  ngOnInit() {
    const appointmentsCollection = collection(this.firestore, 'appointments');
    this.appointments$ = collectionData(appointmentsCollection, { idField: 'id' }).pipe(
      switchMap((appointments: any[]) =>
        forkJoin(
          appointments.map(async (appointment) => {
            const doctorRef = doc(this.firestore, appointment.doctorId.path);
            const patientRef = doc(this.firestore, appointment.patientId.path);
            const doctorSnap = await getDoc(doctorRef);
            const patientSnap = await getDoc(patientRef);
            return {
              doctorName: doctorSnap.data()?.['name'],
              patientName: patientSnap.data()?.['name'],
              appointmentTime: appointment.date.toDate()
            };
          })
        )
      )
    );
  }
}
