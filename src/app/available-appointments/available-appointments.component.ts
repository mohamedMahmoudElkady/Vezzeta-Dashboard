import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../auth-service.service';
import {
  Firestore,
  doc,
  updateDoc,
  getDoc,
  arrayUnion,
  Timestamp,
} from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-available-appointments',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './available-appointments.component.html',
  styleUrls: ['./available-appointments.component.css'],
})
export class AvailableAppointmentsComponent implements OnInit {
  appointmentForm: FormGroup;
  availableAppointments: Timestamp[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private firestore: Firestore
  ) {
    this.appointmentForm = this.fb.group({
      appointmentDate: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.fetchAppointments();
  }

  async fetchAppointments() {
    const currentUser = this.authService.getUser();
    if (currentUser) {
      const doctorRef = doc(this.firestore, 'doctor', currentUser.uid);
      const doctorSnap = await getDoc(doctorRef);
      if (doctorSnap.exists()) {
        this.availableAppointments =
          doctorSnap.data()['availableAppointments'] || [];
      }
    }
  }

  addAppointment() {
    if (this.appointmentForm.valid) {
      const currentUser = this.authService.getUser();
      if (currentUser) {
        const doctorRef = doc(this.firestore, 'doctor', currentUser.uid);
        const appointmentDate = Timestamp.fromDate(
          new Date(this.appointmentForm.value.appointmentDate)
        );

        updateDoc(doctorRef, {
          availableAppointments: arrayUnion(appointmentDate),
        })
          .then(() => {
            console.log('Appointment added successfully');
            this.availableAppointments.push(appointmentDate);
            this.appointmentForm.reset();
          })
          .catch((error) => {
            console.error('Error adding appointment: ', error);
          });
      }
    }
  }
}
