import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // Ensure this is correct
})
export class LoginComponent {
  email: string = ''; // Initialize email variable
  password: string = ''; // Initialize password variable
  errorMessage: string = ''; // Initialize error message variable

  handleLogin() {
    console.log('Email:', this.email);
    console.log('Password:', this.password);
    // Implement your login logic here
  }
}
