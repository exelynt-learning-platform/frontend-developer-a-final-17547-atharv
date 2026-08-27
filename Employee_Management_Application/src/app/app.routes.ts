import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard-component/dashboard-component';

/** Routes available in the employee management application. */
export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: '**', redirectTo: '' },
];
