import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { FirebaseError } from 'firebase/app';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service.service';
import { ToastrService } from 'ngx-toastr';

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
    private authService: AuthService,
    private toastr: ToastrService // Inject ToastrService
  ) {}

  async handleLogin() {
    console.log('Email:', this.email);
    console.log('Password:', this.password);

    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, this.email, this.password);
      const { user } = userCredential;
      console.log('Login successful:', user);

      const userDocRef = doc(this.firestore, `Authorized/${user.uid}`);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('User data from Firestore:', userData);

        this.authService.setUser({ ...user, ...userData });

        // Use toastr for success notification
        this.toastr.success('Login successful! User verified.', 'Success');

        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage = 'User not found in Firestore. Please contact support.';
        console.error('User not found in Firestore:', this.email);
        await this.auth.signOut();
        this.toastr.error(this.errorMessage, 'Error');
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        this.errorMessage = error.message;
      } else {
        this.errorMessage = 'An unexpected error occurred. Please try again.';
      }
      console.error('Login error:', error);

      // Use toastr for error notification
      this.toastr.error(this.errorMessage, 'Login Failed');
    }
  }
}
