import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, getDocs, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-doctors-screen',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './doctors-screen.component.html',
  styleUrl: './doctors-screen.component.css'
})
export class DoctorsScreenComponent implements OnInit{
  doctors: any[] = [];
  editingDoctor: any = null; // To keep track of the user being edited
  constructor(private firestore: Firestore) {} 
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
      console.log('doctors:', this.doctors); // Log users data
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }
  editDoctor(user:any){
    this.editingDoctor = { ...user }; // Make a copy to edit
  }
  async saveDoctor() {
    if (this.editingDoctor) {
      try {
        const userDoc = doc(this.firestore, 'doctor', this.editingDoctor.id);
        await updateDoc(userDoc, this.editingDoctor);
        console.log('Docotor updated:', this.editingDoctor);
        this.fetchDoctors(); // Refresh the user list
        this.editingDoctor = null; // Reset editing state
      } catch (error) {
        console.error('Error updating user:', error);
      }
    }
  }
  
  cancelEdit() {
    this.editingDoctor = null; // Cancel editing
  }
  
  // Delete user logic
  async deleteDoctor(userId: string) {
    try {
      const userDoc = doc(this.firestore, 'doctor', userId);
      await deleteDoc(userDoc);
      console.log('Doctor deleted:', userId);
      this.fetchDoctors(); // Refresh the user list
    } catch (error) {
      console.error('Error deleting doctor:', error);
    }
  }

}
