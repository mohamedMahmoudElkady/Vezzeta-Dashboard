import { Component,OnInit } from '@angular/core';
import { AuthService } from '../auth-service.service';
import { User } from 'firebase/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsersScreenComponent } from "../users-screen/users-screen.component";
import { DoctorsScreenComponent } from '../doctors-screen/doctors-screen.component';
import { AppUser } from '../models/app-user.interface';
import { DoctorProfileComponent } from "../doctor-profile/doctor-profile.component";
import { AppointmentsComponent } from "../appointments/appointments.component";
import { DoctorAppointmentsComponent } from "../doctor-appointments/doctor-appointments.component";
import { TotalRevenueComponent } from "../total-revenue/total-revenue.component";
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule, UsersScreenComponent, DoctorsScreenComponent, DoctorProfileComponent, AppointmentsComponent, DoctorAppointmentsComponent, TotalRevenueComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  user: AppUser | null = null;
  activeTab: string = ''; // Default tab

  isAdmin(): boolean {
    return this.user?.role === 'admin';
  }
  isDoctor(): boolean {
    return this.user?.role === 'doctor';
  }
  // Method to toggle the expanded state of a branch
  
  constructor(private authService: AuthService) {}
  ngOnInit() {
    // Subscribe to the user data
    this.authService.currentUser$.subscribe((user) => {
      this.user = user;
      console.log('Current user:', this.user);
    });
    if (this.user) {
      this.activeTab = (this.user.role === 'admin') ? 'Users' : 'Manage Profile';
    }
  }

  // Method to select a tab
  selectTab(tab: string) {
    this.activeTab = tab;
  }
 
}
