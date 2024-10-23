import { Component, OnInit } from '@angular/core';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { AuthService } from '../auth-service.service'; // Import your AuthService
import { Doctor } from '../models/doctor.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EditDoctorProfileComponent } from '../edit-doctor-profile/edit-doctor-profile.component';

@Component({
  selector: 'app-doctor-profile',
  standalone: true,
  imports: [FormsModule, CommonModule, EditDoctorProfileComponent],
  templateUrl: './doctor-profile.component.html',
  styleUrls: ['./doctor-profile.component.css'],
})
export class DoctorProfileComponent implements OnInit {
  doctor: Doctor | null = null; // Use the Doctor interface
  errorMessage: string = '';
  isEditing: boolean = false; // Control the editing state

  constructor(private firestore: Firestore, private authService: AuthService) {}

  async ngOnInit(): Promise<void> {
    const user = this.authService.getUser();

    if (user) {
      const uid = user.uid;
      await this.loadDoctorDetails(uid);
    } else {
      this.errorMessage = 'User not logged in.';
    }
  }

  private async loadDoctorDetails(uid: string) {
    try {
      const doctorDocRef = doc(this.firestore, `doctor/${uid}`);
      const doctorDoc = await getDoc(doctorDocRef);

      if (doctorDoc.exists()) {
        this.doctor = doctorDoc.data() as Doctor; // Cast the data to Doctor
        console.log('Doctor details:', this.doctor);
      } else {
        this.errorMessage = 'Doctor not found in Firestore.';
      }
    } catch (error) {
      this.errorMessage = 'Error fetching doctor details.';
      console.error('Error:', error);
    }
  }

  editProfile() {
    this.isEditing = !this.isEditing;
  }
}
