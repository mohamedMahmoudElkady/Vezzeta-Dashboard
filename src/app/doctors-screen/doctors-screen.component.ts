import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';

@Component({
  selector: 'app-doctors-screen',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './doctors-screen.component.html',
  styleUrl: './doctors-screen.component.css'
})
export class DoctorsScreenComponent implements OnInit{
  doctors: any[] = [];
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
}
