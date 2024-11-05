import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // default route
  { path: 'login', component: LoginComponent },
  {path:'dashboard', component:DashboardComponent,canActivate:[authGuard]}
];
