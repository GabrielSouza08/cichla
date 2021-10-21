import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginPageComponent } from 'src/app/pages/login-page/login-page.component';
import { DashboardPageComponent } from 'src/app/pages/dashboard-page/dashboard-page.component';
import { HomePageComponent } from 'src/app/pages/home-page/home-page.component';

import { AuthGuard } from '../app/guards/auth-guard.service';


const appRoutes: Routes = [
  { path: '', component: HomePageComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardPageComponent,canActivate: [AuthGuard]},
  { path: 'login', component: LoginPageComponent}
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
