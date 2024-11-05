import { Component, OnInit } from '@angular/core';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { AuthService } from '../auth-service.service'; // Import your AuthService
import { Doctor } from '../models/doctor.interface';
import { getDownloadURL, ref, uploadBytes, getStorage } from '@angular/fire/storage';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService

@Component({
  selector: 'app-doctor-profile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './doctor-profile.component.html',
  styleUrls: ['./doctor-profile.component.css'],
})
export class DoctorProfileComponent implements OnInit {
  doctor: Doctor = {} as Doctor; // Store doctor data here
  errorMessage: string = '';
  isEditing: boolean = false; // Track if fields are editable
  selectedImage: File | null = null; // Store the selected file

  constructor(
    private firestore: Firestore,
    private authService: AuthService,
    private toastr: ToastrService // Inject ToastrService
  ) {}

  async ngOnInit(): Promise<void> {
    const user = this.authService.getUser();
    if (user) {
      const uid = user.uid;
      await this.loadDoctorDetails(uid);
    } else {
      this.errorMessage = 'User not logged in.';
      this.toastr.error(this.errorMessage, 'Error');
    }
  }

  private async loadDoctorDetails(uid: string) {
    try {
      const doctorDocRef = doc(this.firestore, `doctor/${uid}`);
      const doctorDoc = await getDoc(doctorDocRef);

      if (doctorDoc.exists()) {
        this.doctor = doctorDoc.data() as Doctor;
      } else {
        this.errorMessage = 'Doctor not found in Firestore.';
        this.toastr.error(this.errorMessage, 'Error');
      }
    } catch (error) {
      this.errorMessage = 'Error fetching doctor details.';
      console.error('Error:', error);
      this.toastr.error(this.errorMessage, 'Error');
    }
  }

  editProfile() {
    this.isEditing = true;
  }

  cancelEdit() {
    this.isEditing = false;
    const user = this.authService.getUser();
    if (user) {
      this.loadDoctorDetails(user.uid);
    } else {
      this.errorMessage = 'User not logged in.';
      this.toastr.error(this.errorMessage, 'Error');
    }
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedImage = input.files[0];
    }
  }

  async saveProfile() {
    try {
      if (this.selectedImage) {
        const imageUrl = await this.uploadImage(this.selectedImage);
        this.doctor.imageUrl = imageUrl;
      }

      const doctorDocRef = doc(this.firestore, `doctor/${this.doctor.uid}`);
      await setDoc(doctorDocRef, this.doctor, { merge: true });

      // Use toastr for success notification
      this.toastr.success('Profile updated successfully!', 'Success');
      this.isEditing = false; // Disable editing mode
    } catch (error) {
      this.errorMessage = 'Error updating profile. Please try again.';
      console.error('Error updating profile:', error);
      this.toastr.error(this.errorMessage, 'Error');
    }
  }

  private async uploadImage(image: File): Promise<string> {
    const storage = getStorage();
    const storageRef = ref(storage, `images/${image.name}`);
    try {
      const snapshot = await uploadBytes(storageRef, image);
      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }
}
