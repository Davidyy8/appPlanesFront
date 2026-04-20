import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { ConnectComponent } from './components/connect/connect';
import { DashboardComponent } from './components/dashboard/dashboard';
import { RegisterComponent } from './components/register/register';
import { CompletedComponent } from './components/completed/completed';
import { CoupleComponent } from './components/couple/couple';

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

    },
    {
        path: 'dashboard',
        component: DashboardComponent,

    },
    {
        path: 'completed',
        component: CompletedComponent
    },
    {
        path: 'couple',
        component: CoupleComponent
    },
    {
        path: '**',
        redirectTo: 'login'
    },
];
