import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EncaissementQuittanceResponse } from '../encaissement-quittance.service';
import { QuittanceWithEncaissements } from '../quittance-list/quittance-list.component';

export interface EncaissementsDetailsDialogData {
  quittance: QuittanceWithEncaissements;
}

@Component({
  selector: 'app-encaissements-details-dialog',
  templateUrl: './encaissements-details-dialog.component.html',
  styleUrls: ['./encaissements-details-dialog.component.scss']
})
export class EncaissementsDetailsDialogComponent implements OnInit, OnDestroy {

  // Colonnes pour les encaissements globaux
  globalDisplayedColumns = [
    'numero',
    'montant',
    'dateEncaissement',
    'modeEncaissement',
    'statutEncaissement'
  ];

  // Colonnes pour les paiements des encaissements détails
  paiementDisplayedColumns = [
    'encaissementNumero',
    'paiementMontant',
    'paiementDate',
    'paiementMode'
  ];

  private destroy$ = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<EncaissementsDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EncaissementsDetailsDialogData
  ) {}

  ngOnInit(): void {
    // Component initialization
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onClose(): void {
    this.dialogRef.close();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF'
    }).format(amount);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'VALIDE': return 'bg-green-100 text-green-800';
      case 'EN_ATTENTE': return 'bg-orange-100 text-orange-800';
      case 'ANNULE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'VALIDE': return 'Validé';
      case 'EN_ATTENTE': return 'En attente';
      case 'ANNULE': return 'Annulé';
      default: return status;
    }
  }

  onEdit(encaissement: EncaissementQuittanceResponse): void {
    this.dialogRef.close({ action: 'edit', encaissement });
  }

  onDelete(encaissement: EncaissementQuittanceResponse): void {
    this.dialogRef.close({ action: 'delete', encaissement });
  }

  // Méthodes utilitaires pour gérer les types d'encaissements
  
  isEncaissementGlobal(encaissement: any): boolean {
    return 'paiement' in encaissement && !('paiements' in encaissement);
  }

  isEncaissementDetail(encaissement: any): boolean {
    return 'paiements' in encaissement && Array.isArray(encaissement.paiements);
  }

  getEncaissementsGlobaux(): any[] {
    return this.data.quittance.encaissements.filter(enc => this.isEncaissementGlobal(enc));
  }

  getEncaissementsDetails(): any[] {
    return this.data.quittance.encaissements.filter(enc => this.isEncaissementDetail(enc));
  }

  // Flatten tous les paiements des encaissements détails pour l'affichage
  getAllPaiements(): any[] {
    const paiements: any[] = [];
    
    this.getEncaissementsDetails().forEach(encaissement => {
      encaissement.paiements.forEach((paiement: any) => {
        paiements.push({
          ...paiement,
          encaissementNumero: encaissement.numero,
          encaissementUuid: encaissement.uuid,
          parentEncaissement: encaissement
        });
      });
    });
    
    return paiements;
  }

  onEditPaiement(paiement: any): void {
    // Passer l'encaissement parent pour modification
    this.dialogRef.close({ 
      action: 'edit', 
      encaissement: paiement.parentEncaissement 
    });
  }

  onDeletePaiement(paiement: any): void {
    // Pour les paiements, on supprime l'encaissement parent car on ne peut pas supprimer un paiement seul
    this.dialogRef.close({ 
      action: 'delete', 
      encaissement: paiement.parentEncaissement 
    });
  }
}