import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfilesService } from '../profiles.service';
import { UserService } from '@core/services/user/user.service';
import { User } from '@core/services/user/user.interface';
import { NotificationService } from '../notification/notification.service';
import { NotificationComponent } from '../notification/notification.component';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ManagementEntity } from '@core/services/management-entity/management-entity.interface';

@Component({
  selector: 'app-profiles',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    FormsModule,
    ReactiveFormsModule,
    NotificationComponent,
    MatProgressSpinnerModule
  ],
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.scss']
})
export class ProfilesComponent implements OnInit {
  personalEdit = false;
  companyEdit = false;
  passwordEdit = false;
  notificationMessage = '';

  personalForm!: FormGroup;
  companyForm!: FormGroup;
  passwordForm!: FormGroup;

  loadingPersonal = false;
  loadingCompany = false;
  loadingPassword = false;

  errorPersonal = '';
  errorCompany = '';
  errorPassword = '';

  // uuid fictif à remplacer par la vraie valeur (ex: depuis le store ou l'auth)
  userUuid = localStorage.getItem('userUuid') || 'user-uuid-demo';
  companyUuid = localStorage.getItem('companyUuid') || 'company-uuid-demo';

  constructor(
    private fb: FormBuilder,
    private profilesService: ProfilesService,
    private notificationService: NotificationService,
    private userService: UserService
  ) {
    // Initialisation des formulaires
    this.initForms();
  }

  ngOnInit(): void {
    // Récupérer les données de l'utilisateur connecté
    this.userService.get().subscribe((user: User) => {
      // Patch du formulaire personnel
      this.personalForm.patchValue({
        firstname: user.firstName,
        lastname: user.lastName,
        email: user.email
      });

    });

    this.userService.getManagementEntity().subscribe((entity: ManagementEntity) => {
      console.log(entity);
      // Patch du formulaire entreprise
      this.companyForm.patchValue({
        name: entity.name || '',
        acronym: entity.acronym || '',
        email: entity.email || '',
        phone: entity.phone || '',
        address: entity.address || '',
        logo: entity.logo || '',
        fax: entity.fax || '',
        gsm: entity.gsm || '',
        legalStatus: entity.legalStatus || '',
        registrationNumber: entity.registrationNumber || ''
      });
    });
  }

  private initForms() {
    this.personalForm = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]]
    });

    this.companyForm = this.fb.group({
      name: ['', [Validators.required]],
      acronym: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: [''],
      logo: [''],
      fax: [''],
      gsm: [''],
      legalStatus: [''],
      registrationNumber: ['']
    });

    this.passwordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmNewPassword: ['', [Validators.required]]
    }, { validators: this.passwordsMatchValidator });
  }

  passwordsMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmNewPassword = form.get('confirmNewPassword')?.value;
    return newPassword === confirmNewPassword ? null : { passwordMismatch: true };
  }

  cancelEdit(section: string) {
    switch (section) {
      case 'personal': this.personalEdit = false; this.errorPersonal = ''; break;
      case 'company': this.companyEdit = false; this.errorCompany = ''; break;
      case 'password': this.passwordEdit = false; this.errorPassword = ''; break;
    }
  }

  save(section: string) {
    switch (section) {
      case 'personal':
        if (this.personalForm.invalid) { this.personalForm.markAllAsTouched(); return; }
        this.loadingPersonal = true;
        this.errorPersonal = '';
        this.profilesService.updatePersonalInfos(this.personalForm.value).subscribe({
          next: (response) => {
            this.personalEdit = false;
            this.personalForm.patchValue(response);
            this.showSuccess('Informations personnelles mises à jour avec succès.');
          },
          error: (err) => {
            this.errorPersonal = err.error?.message || 'Erreur lors de la sauvegarde.';
          },
          complete: () => {
            this.loadingPersonal = false;
          }
        });
        break;

      case 'company':
        if (this.companyForm.invalid) { this.companyForm.markAllAsTouched(); return; }
        this.loadingCompany = true;
        this.errorCompany = '';
        this.userService.updateManagementEntity(this.companyForm.value).subscribe({
          next: (response) => {
            this.companyEdit = false;
            this.companyForm.patchValue(response);
            this.showSuccess('Informations de la compagnie mises à jour avec succès.');
          },
          error: (err) => {
            this.errorCompany = err.error?.message || 'Erreur lors de la sauvegarde.';
          },
          complete: () => {
            this.loadingCompany = false;
          }
        });
        break;

      case 'password':
        if (this.passwordForm.invalid) { this.passwordForm.markAllAsTouched(); return; }
        this.loadingPassword = true;
        this.errorPassword = '';
        this.profilesService.updatePassword(this.passwordForm.value).subscribe({
          next: () => {
            this.passwordEdit = false;
            this.passwordForm.reset();
            this.showSuccess('Mot de passe mis à jour avec succès.');
          },
          error: (err) => {
            this.errorPassword = err.error?.message || 'Erreur lors du changement de mot de passe.';
          },
          complete: () => {
            this.loadingPassword = false;
          }
        });
        break;
    }
  }

  get personal() { return this.personalForm.controls; }
  get company() { return this.companyForm.controls; }
  get password() { return this.passwordForm.controls; }

  private showSuccess(message: string) {
    this.notificationMessage = message;
    setTimeout(() => {
      this.notificationMessage = '';
    }, 3000);
  }
}
