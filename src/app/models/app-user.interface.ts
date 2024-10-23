// app-user.interface.ts
import { User } from 'firebase/auth'; // Import Firebase's User interface

// Define the AppUser interface extending Firebase User
export interface AppUser extends User {
  role?: string;   // required field for user role
  name?: string;   // Optional field for user name
  phone?: string;  // Optional field for phone number
  specialization?: string; // Optional field for specialization
  clinicLocation?: string; // Optional field for clinic location
  gender?: string; // Optional field for gender
  qualifications?: string; // Optional field for qualifications
  

}
