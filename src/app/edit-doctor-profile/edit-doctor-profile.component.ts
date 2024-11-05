import { Component, Input, OnInit } from '@angular/core';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Doctor } from '../models/doctor.interface';
import { AuthService } from '../auth-service.service';
import { getDownloadURL, ref, uploadBytes, getStorage } from '@angular/fire/storage';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService

@Component({
  selector: 'app-edit-doctor-profile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-doctor-profile.component.html',
  styleUrls: ['./edit-doctor-profile.component.css'],
})
export class EditDoctorProfileComponent implements OnInit {
  @Input() doctor!: Doctor; // Receive the doctor details as an input
  updatedDoctor: Doctor = {} as Doctor; // Create an object to hold the updated doctor details
  errorMessage: string = '';
  selectedImage: File | null = null; // Store the selected file

  constructor(
    private firestore: Firestore,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService // Inject ToastrService
  ) {}

  async ngOnInit(): Promise<void> {
    const user = this.authService.getUser();
    if (user) {
      const doctorDocRef = doc(this.firestore, `doctor/${user.uid}`);
      const doctorSnapshot = await getDoc(doctorDocRef);
      if (doctorSnapshot.exists()) {
        this.updatedDoctor = { uid: user.uid, ...doctorSnapshot.data() } as Doctor;
      } else {
        console.error('Doctor document not found.');
        this.toastr.error('Doctor document not found.', 'Error');
      }
    } else {
      console.error('User not found. Cannot set uid in updatedDoctor.');
      this.toastr.error('User not found. Please log in again.', 'Error');
    }
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedImage = input.files[0]; // Store the selected file
    }
  }

  async updateProfile() {
    try {
      // Upload the image if one is selected
      if (this.selectedImage) {
        const imageUrl = await this.uploadImage(this.selectedImage);
        this.updatedDoctor.imageUrl = imageUrl; // Set the uploaded image URL
      }

      const doctorDocRef = doc(this.firestore, `doctor/${this.updatedDoctor.uid}`);
      await setDoc(doctorDocRef, this.updatedDoctor, { merge: true }); // Update with merge option
      
      // Use toastr for success notification
      this.toastr.success('Profile updated successfully!', 'Success');
      this.router.navigate(['/login']); // Navigate back to the dashboard
    } catch (error) {
      this.errorMessage = 'Error updating profile. Please try again.';
      console.error('Error updating profile:', error);

      // Use toastr for error notification
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
      this.toastr.error('Error uploading image. Please try again.', 'Error');
      throw error;
    }
  }
}
