import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Firestore, collection, getDocs, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService

@Component({
  selector: 'app-users-screen',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './users-screen.component.html',
  styleUrls: ['./users-screen.component.css'] // Corrected from `styleUrl` to `styleUrls`
})
export class UsersScreenComponent implements OnInit {
  users: any[] = [];
  editingUser: any = null; // To keep track of the user being edited

  constructor(private firestore: Firestore, private toastr: ToastrService) {} // Inject ToastrService

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
      this.toastr.error('Error fetching users. Please try again.', 'Error');
    }
  }

  editUser(user: any) {
    this.editingUser = { ...user }; // Make a copy to edit
  }

  async saveUser() {
    if (this.editingUser) {
      try {
        const userDoc = doc(this.firestore, 'User', this.editingUser.id);
        await updateDoc(userDoc, this.editingUser);
        console.log('User updated:', this.editingUser);
        this.toastr.success('User updated successfully!', 'Success');
        this.fetchUsers(); // Refresh the user list
        this.editingUser = null; // Reset editing state
      } catch (error) {
        console.error('Error updating user:', error);
        this.toastr.error('Error updating user. Please try again.', 'Error');
      }
    }
  }

  cancelEdit() {
    this.editingUser = null; // Cancel editing
  }

  // Delete user logic
  async deleteUser(userId: string) {
    try {
      const userDoc = doc(this.firestore, 'User', userId);
      await deleteDoc(userDoc);
      console.log('User deleted:', userId);
      this.toastr.success('User deleted successfully!', 'Success');
      this.fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error deleting user:', error);
      this.toastr.error('Error deleting user. Please try again.', 'Error');
    }
  }
}
