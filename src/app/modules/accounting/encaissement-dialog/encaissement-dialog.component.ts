import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastService } from '../../../components/toast/toast.service';
import {
  EncaissementQuittanceService,
  QuittanceResponse,
  ModeEncaissementResponse,
  EncaissementQuittanceGlobalRequest,
  EncaissementQuittanceDetailRequest,
  EncaissementQuittanceResponse
} from '../encaissement-quittance.service';

export interface EncaissementDialogData {
  quittance: QuittanceResponse;
  soldeQuittance: number;
  isEdit: boolean;
  encaissement?: EncaissementQuittanceResponse;
}

@Component({
  selector: 'app-encaissement-dialog',
  templateUrl: './encaissement-dialog.component.html',
  styleUrls: ['./encaissement-dialog.component.scss']
})
export class EncaissementDialogComponent implements OnInit, OnDestroy {

  encaissementType: 'global' | 'detail' = 'global';
  globalForm!: FormGroup;
  detailForm!: FormGroup;
  modesEncaissement: ModeEncaissementResponse[] = [];
  isLoading = false;

  private destroy$ = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<EncaissementDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EncaissementDialogData,
    private fb: FormBuilder,
    private encaissementService: EncaissementQuittanceService,
    private toastService: ToastService
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadModesEncaissement();

    if (this.data.isEdit && this.data.encaissement) {
      this.populateFormForEdit();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForms(): void {
    // Global encaissement form
    this.globalForm = this.fb.group({
      numero: ['', [Validators.required, Validators.pattern(/^[A-Z0-9-]+$/)]],
      montant: [0, [Validators.required, Validators.min(0.01), this.montantValidator.bind(this)]],
      dateEncaissement: [new Date(), [Validators.required, this.dateValidator]],
      modeEncaissementUuid: ['', Validators.required]
    });

    // Detail encaissement form
    this.detailForm = this.fb.group({
      numero: ['', [Validators.required, Validators.pattern(/^[A-Z0-9-]+$/)]],
      paiements: this.fb.array([this.createPaiementFormGroup()], Validators.minLength(1))
    });
  }

  private createPaiementFormGroup(): FormGroup {
    return this.fb.group({
      montant: [0, [Validators.required, Validators.min(0.01)]],
      dateEncaissement: [new Date(), [Validators.required, this.dateValidator]],
      modeEncaissementUuid: ['', Validators.required]
    });
  }

  private montantValidator(control: AbstractControl): { [key: string]: any } | null {
    const montant = control.value;
    if (montant > this.data.soldeQuittance) {
      return { depassementSolde: true };
    }
    return null;
  }

  private dateValidator(control: AbstractControl): { [key: string]: any } | null {
    const date = new Date(control.value);
    if (date > new Date()) {
      return { dateFuture: true };
    }
    return null;
  }

  get paiementsFormArray(): FormArray {
    return this.detailForm.get('paiements') as FormArray;
  }

  addPaiement(): void {
    this.paiementsFormArray.push(this.createPaiementFormGroup());
  }

  removePaiement(index: number): void {
    if (this.paiementsFormArray.length > 1) {
      this.paiementsFormArray.removeAt(index);
    }
  }

  getTotalPaiements(): number {
    return this.paiementsFormArray.controls.reduce((total, control) => {
      return total + (control.get('montant')?.value || 0);
    }, 0);
  }

  isFormValid(): boolean {
    if (this.encaissementType === 'global') {
      return this.globalForm.valid;
    } else {
      const totalPaiements = this.getTotalPaiements();
      return this.detailForm.valid &&
        totalPaiements > 0 &&
        totalPaiements <= this.data.soldeQuittance;
    }
  }

  onSave(): void {
    if (!this.isFormValid()) {
      this.toastService.show('error', 'Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    this.isLoading = true;

    if (this.encaissementType === 'global') {
      this.saveGlobalEncaissement();
    } else {
      this.saveDetailEncaissement();
    }
  }

  private saveGlobalEncaissement(): void {
    const formValue = this.globalForm.value;
    const request: EncaissementQuittanceGlobalRequest = {
      numero: formValue.numero,
      quittanceUuid: this.data.quittance.uuid,
      montant: formValue.montant,
      date: formValue.dateEncaissement.toISOString(),
      paiement: {
        montant: formValue.montant,
        dateEncaissement: formValue.dateEncaissement.toISOString(),
        modeEncaissementUuid: formValue.modeEncaissementUuid
      }
    };

    const operation$ = this.data.isEdit
      ? this.encaissementService.updateGlobal(this.data.encaissement!.uuid, request)
      : this.encaissementService.createGlobal(request);

    operation$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.toastService.show('success',
            this.data.isEdit ? 'Encaissement modifié avec succès' : 'Encaissement créé avec succès'
          );
          this.dialogRef.close(result);
        },
        error: (error) => {
          console.error('Error saving global encaissement:', error);
          this.toastService.show('error', 'Erreur lors de la sauvegarde');
          this.isLoading = false;
        }
      });
  }

  private saveDetailEncaissement(): void {
    const formValue = this.detailForm.value;
    const totalMontant = this.getTotalPaiements();

    const request: EncaissementQuittanceDetailRequest = {
      numero: formValue.numero,
      quittanceUuid: this.data.quittance.uuid,
      montant: totalMontant,
      date: new Date().toISOString(),
      paiements: formValue.paiements.map((p: any) => ({
        montant: p.montant,
        dateEncaissement: p.dateEncaissement.toISOString(),
        modeEncaissementUuid: p.modeEncaissementUuid
      }))
    };

    const operation$ = this.data.isEdit
      ? this.encaissementService.updateDetail(this.data.encaissement!.uuid, request)
      : this.encaissementService.createDetail(request);

    operation$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.toastService.show('success',
            this.data.isEdit ? 'Encaissement modifié avec succès' : 'Encaissement créé avec succès'
          );
          this.dialogRef.close(result);
        },
        error: (error) => {
          console.error('Error saving detail encaissement:', error);
          this.toastService.show('error', 'Erreur lors de la sauvegarde');
          this.isLoading = false;
        }
      });
  }

  private loadModesEncaissement(): void {
    this.encaissementService.getModesEncaissement()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (modes) => {
          this.modesEncaissement = modes;
        },
        error: (error) => {
          console.error('Error loading modes encaissement:', error);
          this.toastService.show('error', 'Erreur lors du chargement des modes d\'encaissement');
        }
      });
  }

  private populateFormForEdit(): void {
    if (!this.data.encaissement) return;

    // Determine if it's global or detail based on the structure
    // This would need to be enhanced based on actual API response structure
    const isGlobal = 'paiement' in this.data.encaissement;
    this.encaissementType = isGlobal ? 'global' : 'detail';

    if (isGlobal) {
      // Populate global form
      const globalEnc = this.data.encaissement as any; // Cast for now
      this.globalForm.patchValue({
        numero: globalEnc.numero,
        montant: globalEnc.montant,
        dateEncaissement: new Date(globalEnc.paiement.dateEncaissement),
        modeEncaissementUuid: globalEnc.paiement.modeEncaissement.uuid
      });
    } else {
      // Populate detail form
      const detailEnc = this.data.encaissement as any; // Cast for now
      this.detailForm.patchValue({
        numero: detailEnc.numero
      });

      // Clear existing paiements and add from data
      while (this.paiementsFormArray.length > 0) {
        this.paiementsFormArray.removeAt(0);
      }

      detailEnc.paiements.forEach((paiement: any) => {
        const paiementForm = this.fb.group({
          montant: [paiement.montant, [Validators.required, Validators.min(0.01)]],
          dateEncaissement: [new Date(paiement.dateEncaissement), [Validators.required, this.dateValidator]],
          modeEncaissementUuid: [paiement.modeEncaissement.uuid, Validators.required]
        });
        this.paiementsFormArray.push(paiementForm);
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getErrorMessage(controlName: string, formGroup?: any): string {
    const form = formGroup || (this.encaissementType === 'global' ? this.globalForm : this.detailForm);
    const control = form.get(controlName);

    if (!control || !control.errors) return '';

    if (control.errors['required']) return `${controlName} est obligatoire`;
    if (control.errors['min']) return `${controlName} doit être supérieur à 0`;
    if (control.errors['pattern']) return 'Format invalide';
    if (control.errors['depassementSolde']) return 'Le montant ne peut pas dépasser le solde disponible';
    if (control.errors['dateFuture']) return 'La date ne peut pas être dans le futur';

    return 'Erreur de validation';
  }
}