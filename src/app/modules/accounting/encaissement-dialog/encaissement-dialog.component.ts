import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastService } from '../../../components/toast/toast.service';
import {
  EncaissementQuittanceService,
  ModeEncaissementResponse,
  EncaissementQuittanceGlobalRequest,
  EncaissementQuittanceDetailRequest,
  EncaissementQuittanceResponse
} from '../encaissement-quittance.service';
import {QuittanceResponse} from "../accounting.service";

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

  encaissementForm!: FormGroup;
  detailForm!: FormGroup;
  modesEncaissement: ModeEncaissementResponse[] = [];
  isLoading = false;
  hasExistingEncaissements = false;
  
  // Détermine le mode d'affichage selon le contexte
  displayMode: 'simple' | 'detail' = 'simple';
  existingEncaissementType: 'global' | 'detail' | null = null;

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
    this.checkExistingEncaissements();

    if (this.data.isEdit && this.data.encaissement) {
      this.populateFormForEdit();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForms(): void {
    // Formulaire simple pour création ou modification d'encaissement global
    this.encaissementForm = this.fb.group({
      numero: ['', [Validators.required, Validators.pattern(/^[A-Z0-9-]+$/)]],
      montant: [0, [Validators.required, Validators.min(0.01)]],
      dateEncaissement: [new Date(), [Validators.required, this.dateValidator]],
      modeEncaissementUuid: ['', Validators.required]
    });
    
    // Formulaire détaillé pour modification d'encaissement détail
    this.detailForm = this.fb.group({
      numero: ['', [Validators.required, Validators.pattern(/^[A-Z0-9-]+$/)]],
      paiements: this.fb.array([], Validators.minLength(1))
    });
  }
  
  private createPaiementFormGroup(paiement?: any): FormGroup {
    return this.fb.group({
      uuid: [paiement?.uuid || null],
      montant: [paiement?.montant || 0, [Validators.required, Validators.min(0.01)]],
      dateEncaissement: [paiement?.dateEncaissement ? new Date(paiement.dateEncaissement) : new Date(), [Validators.required, this.dateValidator]],
      modeEncaissementUuid: [paiement?.modeEncaissement?.uuid || '', Validators.required]
    });
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

  private dateValidator(control: AbstractControl): { [key: string]: any } | null {
    const date = new Date(control.value);
    if (date > new Date()) {
      return { dateFuture: true };
    }
    return null;
  }

  getMontantSaisi(): number {
    return this.encaissementForm.get('montant')?.value || 0;
  }

  getEncaissementType(): 'global' | 'detail' {
    // En mode édition, retourner le type de l'encaissement existant
    if (this.data.isEdit && this.existingEncaissementType) {
      return this.existingEncaissementType;
    }
    
    const montant = this.getMontantSaisi();
    
    // Si la quittance a déjà un encaissement, on ne peut pas en créer un nouveau
    if (this.hasExistingEncaissements) {
      return 'detail'; // Cela ne devrait pas arriver en création
    }
    
    // Si montant exact = global, si inférieur = détail (acompte)
    // Si supérieur = global (le backend gère le surplus)
    if (montant === this.data.soldeQuittance || montant > this.data.soldeQuittance) {
      return 'global';
    } else {
      return 'detail';
    }
  }

  isFormValid(): boolean {
    if (this.displayMode === 'simple') {
      return this.encaissementForm.valid && this.getMontantSaisi() > 0;
    } else {
      return this.detailForm.valid && this.getTotalPaiements() > 0;
    }
  }

  onSave(): void {
    if (!this.isFormValid()) {
      this.showValidationErrors();
      return;
    }

    this.isLoading = true;

    if (this.displayMode === 'simple') {
      // Mode simple : création ou modification d'encaissement global
      if (this.getEncaissementType() === 'global') {
        this.saveGlobalEncaissement();
      } else {
        this.saveDetailEncaissement();
      }
    } else {
      // Mode détaillé : modification d'encaissement détail
      this.saveDetailEncaissement();
    }
  }

  private showValidationErrors(): void {
    let errorMessages: string[] = [];

    if (this.displayMode === 'simple') {
      const form = this.encaissementForm;
      
      if (form.get('numero')?.invalid) {
        errorMessages.push('Le numéro d\'encaissement est requis');
      }
      if (form.get('montant')?.invalid) {
        const montant = form.get('montant')?.value;
        if (!montant || montant <= 0) {
          errorMessages.push('Le montant doit être supérieur à 0');
        }
      }
      if (form.get('dateEncaissement')?.invalid) {
        errorMessages.push('La date d\'encaissement est requise');
      }
      if (form.get('modeEncaissementUuid')?.invalid) {
        errorMessages.push('Le mode d\'encaissement est requis');
      }
    } else {
      const form = this.detailForm;
      
      if (form.get('numero')?.invalid) {
        errorMessages.push('Le numéro d\'encaissement est requis');
      }
      
      const totalPaiements = this.getTotalPaiements();
      if (totalPaiements === 0) {
        errorMessages.push('Au moins un paiement est requis');
      }
      
      // Vérifier chaque paiement
      this.paiementsFormArray.controls.forEach((paiement, index) => {
        if (paiement.get('montant')?.invalid) {
          errorMessages.push(`Paiement ${index + 1}: montant invalide`);
        }
        if (paiement.get('dateEncaissement')?.invalid) {
          errorMessages.push(`Paiement ${index + 1}: date invalide`);
        }
        if (paiement.get('modeEncaissementUuid')?.invalid) {
          errorMessages.push(`Paiement ${index + 1}: mode d'encaissement requis`);
        }
      });
    }

    if (errorMessages.length > 0) {
      this.toastService.show('error', errorMessages.join(' • '));
    }
  }

  private saveGlobalEncaissement(): void {
    const formValue = this.encaissementForm.value;
    const request: EncaissementQuittanceGlobalRequest = {
      numero: formValue.numero,
      quittanceUuid: this.data.quittance.uuid,
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
    let request: EncaissementQuittanceDetailRequest;
    
    if (this.displayMode === 'simple') {
      // Création d'un encaissement détail avec un seul paiement
      const formValue = this.encaissementForm.value;
      const montantSaisi = this.getMontantSaisi();
      
      request = {
        numero: formValue.numero,
        quittanceUuid: this.data.quittance.uuid,
        paiements: [{
          montant: montantSaisi,
          dateEncaissement: formValue.dateEncaissement.toISOString(),
          modeEncaissementUuid: formValue.modeEncaissementUuid
        }]
      };
    } else {
      // Modification d'un encaissement détail avec plusieurs paiements
      const formValue = this.detailForm.value;
      
      request = {
        numero: formValue.numero,
        quittanceUuid: this.data.quittance.uuid,
        paiements: formValue.paiements.map((p: any) => ({
          montant: p.montant,
          dateEncaissement: p.dateEncaissement.toISOString(),
          modeEncaissementUuid: p.modeEncaissementUuid
        }))
      };
    }

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

    const encaissement = this.data.encaissement as any;
    
    // Détermine si c'est global ou détail
    // Global = propriété "paiement" (singulier)
    // Détail = propriété "paiements" (pluriel)
    const isGlobal = 'paiement' in encaissement && !('paiements' in encaissement);
    const isDetail = 'paiements' in encaissement && Array.isArray(encaissement.paiements);
    
    if (isGlobal) {
      // Encaissement global : mode simple
      this.displayMode = 'simple';
      this.existingEncaissementType = 'global';
      this.encaissementForm.patchValue({
        numero: encaissement.numero,
        montant: encaissement.paiement.montant,
        dateEncaissement: new Date(encaissement.paiement.dateEncaissement),
        modeEncaissementUuid: encaissement.paiement.modeEncaissement.uuid
      });
    } else if (isDetail) {
      // Encaissement détail : mode détaillé avec tous les paiements
      this.displayMode = 'detail';
      this.existingEncaissementType = 'detail';
      this.detailForm.patchValue({
        numero: encaissement.numero
      });
      
      // Vider le FormArray et ajouter tous les paiements
      while (this.paiementsFormArray.length > 0) {
        this.paiementsFormArray.removeAt(0);
      }
      
      encaissement.paiements.forEach((paiement: any) => {
        this.paiementsFormArray.push(this.createPaiementFormGroup(paiement));
      });
    } else {
      console.error('Structure d\'encaissement non reconnue:', encaissement);
      this.toastService.show('error', 'Structure d\'encaissement non reconnue');
    }
  }

  private checkExistingEncaissements(): void {
    // Vérifie si la quittance a déjà des encaissements
    // Si le solde est inférieur au montant total de la quittance, c'est qu'il y a déjà des encaissements
    this.hasExistingEncaissements = this.data.soldeQuittance < this.data.quittance.montant;
  }

  onCancel(): void {
    this.dialogRef.close();
  }


  getEncaissementTypeLabel(): string {
    const type = this.getEncaissementType();
    if (type === 'global') {
      return this.hasExistingEncaissements ? 'Encaissement global (avec surplus)' : 'Encaissement global';
    } else {
      return this.hasExistingEncaissements ? 'Acompte (encaissement partiel)' : 'Acompte (encaissement partiel)';
    }
  }
}