import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, getDocs, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService

@Component({
  selector: 'app-doctors-screen',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './doctors-screen.component.html',
  styleUrls: ['./doctors-screen.component.css'] // Corrected from `styleUrl` to `styleUrls`
})
export class DoctorsScreenComponent implements OnInit {
  doctors: any[] = [];
  editingDoctor: any = null; // To keep track of the doctor being edited

  constructor(private firestore: Firestore, private toastr: ToastrService) {} // Inject ToastrService

  async ngOnInit(): Promise<void> {
    await this.fetchDoctors();
  }

  async fetchDoctors() {
    try {
      const querySnapshot = await getDocs(collection(this.firestore, 'doctor'));
      this.doctors = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log('doctors:', this.doctors); // Log doctors data
    } catch (error) {
      console.error('Error fetching doctors:', error);
      this.toastr.error('Error fetching doctors. Please try again.', 'Error');
    }
  }

  editDoctor(doctor: any) {
    this.editingDoctor = { ...doctor }; // Make a copy to edit
  }

  async saveDoctor() {
    if (this.editingDoctor) {
      try {
        const doctorDoc = doc(this.firestore, 'doctor', this.editingDoctor.id);
        await updateDoc(doctorDoc, this.editingDoctor);
        console.log('Doctor updated:', this.editingDoctor);
        this.toastr.success('Doctor profile updated successfully!', 'Success');
        this.fetchDoctors(); // Refresh the doctor list
        this.editingDoctor = null; // Reset editing state
      } catch (error) {
        console.error('Error updating doctor:', error);
        this.toastr.error('Error updating doctor profile. Please try again.', 'Error');
      }
    }
  }

  cancelEdit() {
    this.editingDoctor = null; // Cancel editing
  }

  async deleteDoctor(userId: string) {
    try {
      const doctorDoc = doc(this.firestore, 'doctor', userId);
      await deleteDoc(doctorDoc);
      console.log('Doctor deleted:', userId);
      this.toastr.success('Doctor deleted successfully!', 'Success');
      this.fetchDoctors(); // Refresh the doctor list
    } catch (error) {
      console.error('Error deleting doctor:', error);
      this.toastr.error('Error deleting doctor. Please try again.', 'Error');
    }
  }
}
