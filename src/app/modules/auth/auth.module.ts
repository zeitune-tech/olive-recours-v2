import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { authRoutes } from "./auth.routes";

import { AuthSignInComponent } from "./sign-in/sign-in.component";
import { MatSelectModule } from "@angular/material/select";
import { SharedModule } from "../../shared/shared.module";
import { MatRadioModule } from '@angular/material/radio';
import { MatStepperModule } from '@angular/material/stepper';
import { AuthForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { AuthSignUpComponent } from "./sign-up/sign-up.component";
import { StepOneComponent } from "./sign-up/stepOne/step-one.component";
import { StepTwoComponent } from "./sign-up/stepTwo/step-two.component";
import { StepThreeComponent } from "./sign-up/stepThree/step-three.component";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { CreationDialogComponent } from "./sign-up/creation-dialog/creation-dialog.component";
import { StepFourComponent } from "./sign-up/stepFour/step-four.component";
import { DialogModule } from "@angular/cdk/dialog";

import { CdkStepper } from '@angular/cdk/stepper'

@NgModule({
    declarations: [
        AuthSignInComponent,
        AuthForgotPasswordComponent,
        AuthSignUpComponent,
        StepOneComponent,
        StepTwoComponent,
        StepThreeComponent,
        StepFourComponent,
        CreationDialogComponent
    ],
    imports: [
        RouterModule.forChild(authRoutes),

        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        ReactiveFormsModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        MatCheckboxModule,
        CommonModule,
        RouterModule,
        MatDividerModule,
        
        MatRadioModule,
        MatDialogModule,
        DialogModule,
        MatSelectModule,
        MatStepperModule,
        SharedModule
    ],
    exports: [
    ],
    providers: [
        { provide: CdkStepper, useClass: CdkStepper }
    ]
})
export class AuthModule {

}