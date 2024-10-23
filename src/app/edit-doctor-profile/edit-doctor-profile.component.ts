// edit-doctor-profile.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Doctor } from '../models/doctor.interface';
import { AuthService } from '../auth-service.service'; // Import your AuthService
import {
  getDownloadURL,
  ref,
  uploadBytes,
  getStorage,
} from '@angular/fire/storage';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-doctor-profile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-doctor-profile.component.html',
  styleUrls: ['./edit-doctor-profile.component.css'],
})
export class EditDoctorProfileComponent implements OnInit {
  @Input() doctor!: Doctor; // Receive the doctor details as an input
  updatedDoctor: Doctor = { ...this.doctor }; // Create a copy of the doctor details for editing
  errorMessage: string = '';
  selectedImage: File | null = null; // Store the selected file

  constructor(private firestore: Firestore, private router: Router, private authService: AuthService) {} // Inject AuthService

  ngOnInit(): void {
    // Set the UID of the current user as soon as the component initializes
    const user = this.authService.getUser();
    if (user) {
      this.updatedDoctor.uid = user.uid; // Set the uid explicitly
    } else {
      console.error('User not found. Cannot set uid in updatedDoctor.');
    }
    
    // Optionally log the initial doctor object
    console.log('Initial doctor:', this.doctor);
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

      // Log the updatedDoctor object before saving
      console.log('Updated doctor details:', this.updatedDoctor);

      const doctorDocRef = doc(this.firestore, `doctor/${this.updatedDoctor.uid}`); // Use updatedDoctor.uid
      await setDoc(doctorDocRef, this.updatedDoctor); // Update the doctor details in Firestore
      alert('Profile updated successfully!');
      this.router.navigate(['/login']); // Navigate back to the dashboard
    } catch (error) {
      this.errorMessage = 'Error updating profile. Please try again.';
      console.error('Error updating profile:', error);
    }
  }

  private async uploadImage(image: File): Promise<string> {
    const storage = getStorage(); // Get the Firebase Storage instance
    const storageRef = ref(storage, `images/${image.name}`);
    try {
      // Upload the file to Firebase Storage
      const snapshot = await uploadBytes(storageRef, image);
      // Get the image URL after upload is successful
      const url = await getDownloadURL(snapshot.ref);
      console.log('Uploaded image URL:', url);
      return url; // Return the URL for the uploaded image
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error; // Throw the error to handle it in the updateProfile method
    }
  }
}
