import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { ConnectComponent } from './components/connect/connect';
import { DashboardComponent } from './components/dashboard/dashboard';
import { RegisterComponent } from './components/register/register';
import { CompletedComponent } from './components/completed/completed';
import { CoupleComponent } from './components/couple/couple';
import { authGuard } from './guards/auth-guard';
import { ProfileComponent } from './components/profile/profile';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'connect',
        component: ConnectComponent,
        canActivate: [authGuard]

    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard]

    },
    {
        path: 'completed',
        component: CompletedComponent,
        canActivate: [authGuard]
    },
    {
        path: 'couple',
        component: CoupleComponent,
        canActivate: [authGuard]
    },
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [authGuard]
    },
    {
        path: '**',
        redirectTo: 'login'
    },
];
