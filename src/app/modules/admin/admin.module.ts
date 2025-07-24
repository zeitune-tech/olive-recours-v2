import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { adminRoutes } from './admin.routes';
import { OrganizationComponent } from './users/organization/organization.component';



@NgModule({
  declarations: [
  
    OrganizationComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(adminRoutes),
  ]
})
export class AdminModule { }
