import { Component,OnInit } from '@angular/core';
import { AuthService } from '../auth-service.service';
import { User } from 'firebase/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsersScreenComponent } from "../users-screen/users-screen.component";
import { DoctorsScreenComponent } from '../doctors-screen/doctors-screen.component';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule, UsersScreenComponent, DoctorsScreenComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  user: User | null = null;

  // Method to toggle the expanded state of a branch
  
  constructor(private authService: AuthService) {}
  ngOnInit() {
    // Subscribe to the user data
    this.authService.currentUser$.subscribe((user) => {
      this.user = user;
      console.log('Current user:', this.user);
    });
  }
  activeTab: string = 'Users'; // Default tab

  // Method to select a tab
  selectTab(tab: string) {
    this.activeTab = tab;
  }
 
}
