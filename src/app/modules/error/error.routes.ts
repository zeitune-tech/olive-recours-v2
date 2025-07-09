import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path     : '',
        loadComponent : () => import('./error-404/error-404.component').then(m => m.Error404Component)
    },
    {
        path     : 'error-404',
        loadComponent : () => import('./error-404/error-404.component').then(m => m.Error404Component)
    },
    {
        path     : 'error-500',
        loadComponent : () => import('./error-500/error-500.component').then(m => m.Error500Component)
    }
];
