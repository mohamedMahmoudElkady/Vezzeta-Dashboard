import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { FirebaseError } from 'firebase/app';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, CommonModule],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router,
    private authService: AuthService
  ) {}

  async handleLogin() {
    console.log('Email:', this.email);
    console.log('Password:', this.password);

    try {
      // Sign in the user with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(this.auth, this.email, this.password);
      const { user } = userCredential;
      console.log('Login successful:', user);

      // Now retrieve additional user details from Firestore
      const userDocRef = doc(this.firestore, `Authorized/${user.uid}`);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data(); // Get the document data
        console.log('User data from Firestore:', userData);

        // Store user data in the AuthService
        this.authService.setUser({ ...user, ...userData });

        alert('Login successful! User verified.');

        // Navigate to the dashboard
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage = 'User not found in Firestore. Please contact support.';
        console.error('User not found in Firestore:', this.email);
        await this.auth.signOut();
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        this.errorMessage = error.message;
      } else {
        this.errorMessage = 'An unexpected error occurred. Please try again.';
      }
      console.error('Login error:', error);
    }
  }
}
