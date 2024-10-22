import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore'; // Import Firestore functions
import { FirebaseError } from 'firebase/app'; // Import FirebaseError
import { Router } from '@angular/router';
import { AuthService } from '../auth-service.service' // Import the service

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

  constructor(private auth: Auth, private firestore: Firestore, private router: Router, private authService: AuthService  ) {} // Inject Firestore

  async handleLogin() {
    console.log('Email:', this.email);
    console.log('Password:', this.password);

    try {
      // Sign in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(this.auth, this.email, this.password);
      console.log('Login successful:', userCredential.user);

      // Now check if the user exists in Firestore
      const userDocRef = doc(this.firestore, `Authorized/${userCredential.user.uid}`); // Adjust the path according to your Firestore structure
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        this.authService.setUser(userCredential.user);

        // User exists in Firestore, proceed to redirect or other actions
        alert('Login successful! User verified.');

        // Redirect to the desired route or perform actions
        this.router.navigate(['/dashboard'])
      } else {
        // User does not exist in Firestore
        this.errorMessage = 'User not found in Firestore. Please contact support.';
        console.error('User not found in Firestore:', this.email);
        // Optionally, sign out the user
        await this.auth.signOut();
      }
    } catch (error) {
      // Handle login errors with type assertion
      if (error instanceof FirebaseError) {
        this.errorMessage = error.message; // Access the message property of the Firebase error
      } else {
        this.errorMessage = 'An unexpected error occurred. Please try again.';
      }
      console.error('Login error:', error);
    }
  }
}
