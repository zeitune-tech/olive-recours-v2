import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  logo: string | null = null;
  timestamp: number = Date.now();

  personalForm!: FormGroup;
  companyForm!: FormGroup;
  passwordForm!: FormGroup;

  loadingPersonal = false;
  loadingCompany = false;
  loadingPassword = false;

  selectedImage: string | null = null;
  selectedFile: File | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      this.selectedFile = input.files[0];
      
      reader.onload = (e) => {
        this.selectedImage = e.target?.result as string;
      };
      
      reader.readAsDataURL(this.selectedFile);
    }
  }

  validateImage(): void {
    if (this.selectedFile) {
      this.userService.uploadFile(this.selectedFile).subscribe({
        next: () => {
          // Reset selected image and file
          this.selectedImage = null;
          this.selectedFile = null;
          
          // Refresh the logo from the server
          this.userService.getManagementEntity().subscribe((entity: ManagementEntity) => {
            this.logo = entity.logo;
            this.timestamp = Date.now(); // Update timestamp to force new image load
            this.notificationService.showMessage('Image mise à jour avec succès.');
            this._changeDetectorRef.markForCheck();
          });
        },
        error: (err) => {
          console.error('Erreur lors de l\'upload de l\'image:', err);
        }
      });
    }
  }

  rejectImage(): void {
    this.selectedImage = null;
    this.selectedFile = null;
  }

  errorPersonal = '';
  errorCompany = '';
  errorPassword = '';

  constructor(
    private fb: FormBuilder,
    private profilesService: ProfilesService,
    private notificationService: NotificationService,
    private userService: UserService,
    private _changeDetectorRef: ChangeDetectorRef,
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
      this._changeDetectorRef.markForCheck();
    });

    this.userService.getManagementEntity().subscribe((entity: ManagementEntity) => {
      this.logo = entity.logo;
      // Patch du formulaire entreprise
      this.companyForm.patchValue({
        name: entity.name || '',
        acronym: entity.acronym || '',
        email: entity.email || '',
        phone: entity.phone || '',
        address: entity.address || '',
        fax: entity.fax || '',
        gsm: entity.gsm || '',
        legalStatus: entity.legalStatus || '',
        registrationNumber: entity.registrationNumber || ''
      });
      this._changeDetectorRef.markForCheck();
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
        this.userService.updatePersonalInfos(this.personalForm.value).subscribe({
          next: (response) => {
            this.personalEdit = false;
            this.personalForm.patchValue(response);
            this.notificationService.showMessage('Informations personnelles mises à jour avec succès.');
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
        this.userService.updateManagementEntity({...this.companyForm.value, logo: this.logo}).subscribe({
          next: (response) => {
            this.companyEdit = false;
            this.companyForm.patchValue(response);
            this.notificationService.showMessage('Informations de la compagnie mises à jour avec succès.');
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
        this.userService.updatePassword(this.passwordForm.value).subscribe({
          next: () => {
            this.passwordEdit = false;
            this.passwordForm.reset();
            this.notificationService.showMessage('Mot de passe mis à jour avec succès.');
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

}
