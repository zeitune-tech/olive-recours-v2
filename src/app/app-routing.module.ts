import { NgModule } from '@angular/core';
import { ExtraOptions, PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { PERMISSIONS } from '@core/permissions/permissions.data';
import { InitialDataResolver } from './app.resolver';
import { AuthGuard } from '@core/auth/guards/auth.guard';
import { NoAuthGuard } from '@core/auth/guards/noAuth.guard';

const routerConfig: ExtraOptions = {
    preloadingStrategy       : PreloadAllModules,
  scrollPositionRestoration: 'enabled'
};


const routes: Routes = [
    {path: '', pathMatch : 'full', redirectTo: 'dashboard'},
    
    {path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'dashboard'},
    {path: 'signed-up-redirect', pathMatch: 'full', redirectTo: 'dashboard'},

    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
    },

    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'sign-out', loadComponent: () => import('./modules/auth/sign-out/sign-out.component').then(m => m.AuthSignOutComponent)},
            {path: 'reset-password', loadComponent: () => import('./modules/auth/reset-password/reset-password.component').then(m => m.AuthResetPasswordComponent)},
        ]
    },
    {
        path       : '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component  : LayoutComponent,
        resolve    : {
            initialData: InitialDataResolver,
        },
        children   : [
            {
                path: 'dashboard',
                canActivate: [],
                canActivateChild: [],
                data: {
                    permission: null
                },
                resolve: {
                    // data: DashboardResolver
                },
                loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule)
            },
            {
                path: 'claims',
                canActivate: [],
                canActivateChild: [],
                data: {
                    permission: null
                },
                resolve: {
                    // ClaimsResolver
                },
                loadChildren: () => import('./modules/claims/claims.module').then(m => m.ClaimsModule)
            },
            {
                path: "admin",
                canActivate: [],
                canActivateChild: [],
                data: {
                },
                resolve: {
                    // ClaimsResolver
                },
                loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule)
            },
            {
                path: 'statements',
                canActivate: [],
                canActivateChild: [],
                data: {
                    permission: null
                },
                resolve: {
                    // StatementsResolver
                },
                loadChildren: () => import('./modules/statements/statements.module').then(m => m.StatementsModule)
            },
            {
                path: 'accounting',
                canActivate: [],
                canActivateChild: [],
                data: {
                    permission: null
                },
                resolve: {
                    // StatementsResolver
                },
                loadChildren: () => import('./modules/accounting/accounting.module').then(m => m.AccountingModule)
            },
            {path: 'profile', loadChildren: () => import('./modules/profiles/profiles.module').then(m => m.ProfilesModule)},

            // 404 & Catch all
            {path: 'error', pathMatch: 'full', loadChildren: () => import('./modules/error/error.module').then(m => m.ErrorModule), data: {layout: "empty"}},
            {path: '**', redirectTo: 'error'},
        ]
    },
];


@NgModule({
    imports: [RouterModule.forRoot(routes, routerConfig)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
