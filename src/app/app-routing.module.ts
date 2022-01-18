import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './_helpers';
import { Role } from './_models';

const homeModule = () => import('./home/home.module').then(x => x.HomeModule);
const userModule = () => import('./account/account.module').then(x => x.AccountModule);
const adminModule = () => import('./admin/admin.module').then(x => x.AdminModule);
const profileModule = () => import('./profile/profile.module').then(x => x.ProfileModule);
const chefModule = () => import('./chef/chef.module').then(x => x.ChefModule);

const routes: Routes = [
    { path: '', loadChildren: homeModule, canActivate: [AuthGuard] },
    { path: 'account', loadChildren: userModule },
    { path: 'profile', loadChildren: profileModule, canActivate: [AuthGuard] },
    { path: 'admin', loadChildren: adminModule, canActivate: [AuthGuard], data: { roles: [Role.Admin] } },
    { path: 'my-recipes', loadChildren: chefModule, canActivate: [AuthGuard], data: { roles: [Role.Chef] } },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
