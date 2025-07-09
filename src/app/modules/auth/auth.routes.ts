
import { Routes } from '@angular/router';
import { AuthSignInComponent } from './sign-in/sign-in.component';
import { AuthForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthSignUpComponent } from './sign-up/sign-up.component';

export const authRoutes: Routes = [
    {
        path: 'sign-in', 
        component: AuthSignInComponent,
    },
    {
        path: 'sign-up',
        component: AuthSignUpComponent
    },
    {
        path: 'forgot-password',
        component: AuthForgotPasswordComponent
    }
]