import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-users-screen',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './users-screen.component.html',
  styleUrl: './users-screen.component.css'
})
export class UsersScreenComponent implements OnInit {
  users: any[] = [];
  constructor(private firestore: Firestore) {} 
  async ngOnInit(): Promise<void> {
  await this.fetchUsers();
}

// Fetch users from Firestore
async fetchUsers() {
  try {
    const querySnapshot = await getDocs(collection(this.firestore, 'User'));
    this.users = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log('Users:', this.users); // Log users data
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}
  

}
