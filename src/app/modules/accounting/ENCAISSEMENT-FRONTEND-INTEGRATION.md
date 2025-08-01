# Guide d'Intégration Frontend - Module Encaissements de Quittances

## Vue d'ensemble

Ce guide détaille l'intégration des fonctionnalités d'encaissement de quittances dans les composants frontend existants, en réutilisant l'architecture actuelle du système de gestion des recours d'assurance.

## Architecture des Encaissements

### Types d'Encaissements

Le système supporte deux types d'encaissements avec héritage polymorphe :

1. **EncaissementQuittanceGlobal** - Encaissement unique avec un seul paiement
2. **EncaissementQuittanceDetail** - Encaissement multiple avec plusieurs paiements détaillés

### Entités Principales

```typescript
// Base abstraite pour tous les encaissements
interface EncaissementQuittanceResponse {
  uuid: string;
  numero: string;
  quittance: QuittanceResponse;
  montant: number;
  date: string; // ISO DateTime
}

// Encaissement global (paiement unique)
interface EncaissementQuittanceGlobalResponse extends EncaissementQuittanceResponse {
  paiement: PaiementResponse;
}

// Encaissement détaillé (paiements multiples)
interface EncaissementQuittanceDetailResponse extends EncaissementQuittanceResponse {
  paiements: PaiementResponse[];
}

// Détail d'un paiement
interface PaiementResponse {
  uuid: string;
  montant: number;
  dateEncaissement: string;
  modeEncaissement: ModeEncaissementResponse;
}
```

## API Endpoints Disponibles

### 1. Encaissements Génériques
**Base URL:** `/app/encaissement-quittance`

- `GET /` - Liste tous les encaissements
- `GET /{uuid}` - Détails d'un encaissement par UUID
- `GET /numero/{numero}` - Recherche par numéro d'encaissement
- `DELETE /{uuid}` - Suppression d'un encaissement
- `GET /quittance/{quittanceUuid}` - Encaissements d'une quittance
- `GET /date-range` - Encaissements par période
- `GET /date-range/total-montant` - Total des montants sur une période
- `GET /exists/{numero}` - Vérification d'existence par numéro

### 2. Encaissements Globaux (Paiement Unique)
**Base URL:** `/app/encaissement-quittance-global`

- `GET /` - Liste des encaissements globaux
- `POST /` - Création d'un encaissement global
- `PUT /{uuid}` - Mise à jour d'un encaissement global
- `GET /paiement/{paiementUuid}` - Encaissement par paiement
- `GET /mode-encaissement/{modeUuid}` - Filtrage par mode d'encaissement

### 3. Encaissements Détaillés (Paiements Multiples)
**Base URL:** `/app/encaissement-quittance-detail`

- `GET /` - Liste des encaissements détaillés
- `POST /` - Création d'un encaissement détaillé
- `PUT /{uuid}` - Mise à jour d'un encaissement détaillé
- `GET /paiement/{paiementUuid}` - Encaissements par paiement
- `GET /{encaissementUuid}/paiements/count` - Nombre de paiements
- `GET /min-paiements/{minPaiements}` - Encaissements avec minimum de paiements

### 4. États et Rapports
**Base URL:** `/app/quittance-statements`

#### États des Quittances
- `GET /encaissement` + `GET /encaissement/pdf` - États d'encaissement
- `GET /reglement` + `GET /reglement/pdf` - États de règlement
- `GET /encaissements` + `GET /encaissements/pdf` - États des encaissements

**Paramètres communs:**
- `companyUuid` (UUID) - Obligatoire
- `startDate` & `endDate` (ISO DateTime) - Pour période personnalisée
- `month` & `year` (int) - Pour état mensuel

## Intégration dans les Composants Existants

### 1. Extension du QuittanceListComponent

#### Nouvelles colonnes à ajouter :
```typescript
// Dans la configuration des colonnes du tableau
export const ENCAISSEMENT_COLUMNS = [
  { key: 'quittanceNumero', label: 'N° Quittance', sortable: true },
  { key: 'montantQuittance', label: 'Montant Quittance', type: 'currency' },
  { key: 'dateSortQuittance', label: 'Date Sort', type: 'date' },
  // Nouvelles colonnes pour encaissements
  { key: 'nombreEncaissements', label: 'Nb Encaissements', type: 'number' },
  { key: 'montantEncaisse', label: 'Montant Encaissé', type: 'currency' },
  { key: 'soldeQuittance', label: 'Solde', type: 'currency', highlight: true },
  { key: 'statutEncaissement', label: 'Statut', type: 'badge' },
  { key: 'actions', label: 'Actions', type: 'actions' }
];
```

#### Actions disponibles par ligne :
```typescript
export const ENCAISSEMENT_ACTIONS = [
  { 
    id: 'view-encaissements', 
    label: 'Voir Encaissements', 
    icon: 'visibility',
    condition: (item) => item.nombreEncaissements > 0
  },
  { 
    id: 'add-encaissement', 
    label: 'Ajouter Encaissement', 
    icon: 'add_circle',
    condition: (item) => item.soldeQuittance > 0
  },
  { 
    id: 'edit-encaissement', 
    label: 'Modifier Encaissement', 
    icon: 'edit',
    condition: (item) => item.nombreEncaissements === 1
  }
];
```

### 2. Nouveau Component : EncaissementDialogComponent

#### Structure du composant :
```typescript
@Component({
  selector: 'app-encaissement-dialog',
  template: `
    <h2 mat-dialog-title>{{ isEdit ? 'Modifier' : 'Créer' }} Encaissement</h2>
    
    <mat-dialog-content>
      <!-- Informations de la quittance (readonly) -->
      <div class="quittance-info">
        <h3>Quittance: {{ data.quittance.numero }}</h3>
        <p>Montant: {{ data.quittance.montant | currency:'XOF' }}</p>
        <p>Solde à encaisser: {{ data.soldeQuittance | currency:'XOF' }}</p>
      </div>

      <!-- Type d'encaissement -->
      <mat-radio-group [(ngModel)]="encaissementType" name="encaissementType">
        <mat-radio-button value="global">Encaissement Global</mat-radio-button>
        <mat-radio-button value="detail">Encaissement Détaillé</mat-radio-button>
      </mat-radio-group>

      <!-- Formulaire Encaissement Global -->
      <div *ngIf="encaissementType === 'global'" [formGroup]="globalForm">
        <mat-form-field>
          <mat-label>Numéro d'encaissement</mat-label>
          <input matInput formControlName="numero" required>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Montant</mat-label>
          <input matInput type="number" formControlName="montant" required>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Date d'encaissement</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="dateEncaissement">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Mode d'encaissement</mat-label>
          <mat-select formControlName="modeEncaissementUuid">
            <mat-option *ngFor="let mode of modesEncaissement" [value]="mode.uuid">
              {{ mode.libelle }}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <!-- Formulaire Encaissement Détaillé -->
      <div *ngIf="encaissementType === 'detail'" [formGroup]="detailForm">
        <mat-form-field>
          <mat-label>Numéro d'encaissement</mat-label>
          <input matInput formControlName="numero" required>
        </mat-form-field>

        <!-- Liste des paiements -->
        <div formArrayName="paiements">
          <h4>Paiements</h4>
          <div *ngFor="let paiement of paiementsFormArray.controls; let i = index" 
               [formGroupName]="i" class="paiement-item">
            
            <mat-form-field>
              <mat-label>Montant</mat-label>
              <input matInput type="number" formControlName="montant" required>
            </mat-form-field>

            <mat-form-field>
              <mat-label>Date</mat-label>
              <input matInput [matDatepicker]="paiementPicker" formControlName="dateEncaissement">
              <mat-datepicker-toggle matSuffix [for]="paiementPicker"></mat-datepicker-toggle>
              <mat-datepicker #paiementPicker></mat-datepicker>
            </mat-form-field>

            <mat-form-field>
              <mat-label>Mode d'encaissement</mat-label>
              <mat-select formControlName="modeEncaissementUuid">
                <mat-option *ngFor="let mode of modesEncaissement" [value]="mode.uuid">
                  {{ mode.libelle }}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <button mat-icon-button (click)="removePaiement(i)" color="warn">
              <mat-icon>delete</mat-icon>
            </button>
          </div>

          <button mat-button (click)="addPaiement()" color="primary">
            <mat-icon>add</mat-icon> Ajouter Paiement
          </button>
        </div>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Annuler</button>
      <button mat-raised-button color="primary" (click)="onSave()" 
              [disabled]="!isFormValid()">
        {{ isEdit ? 'Modifier' : 'Créer' }}
      </button>
    </mat-dialog-actions>
  `
})
export class EncaissementDialogComponent {
  // Implementation...
}
```

### 3. Services Angular

#### EncaissementQuittanceService
```typescript
@Injectable()
export class EncaissementQuittanceService {
  
  // Encaissements génériques
  getAll(): Observable<EncaissementQuittanceResponse[]> {
    return this.http.get<EncaissementQuittanceResponse[]>(`${this.baseUrl}/encaissement-quittance`);
  }

  getByQuittance(quittanceUuid: string): Observable<EncaissementQuittanceResponse[]> {
    return this.http.get<EncaissementQuittanceResponse[]>(
      `${this.baseUrl}/encaissement-quittance/quittance/${quittanceUuid}`
    );
  }

  // Encaissements globaux
  createGlobal(request: EncaissementQuittanceGlobalRequest): Observable<EncaissementQuittanceGlobalResponse> {
    return this.http.post<EncaissementQuittanceGlobalResponse>(
      `${this.baseUrl}/encaissement-quittance-global`, request
    );
  }

  updateGlobal(uuid: string, request: EncaissementQuittanceGlobalRequest): Observable<EncaissementQuittanceGlobalResponse> {
    return this.http.put<EncaissementQuittanceGlobalResponse>(
      `${this.baseUrl}/encaissement-quittance-global/${uuid}`, request
    );
  }

  // Encaissements détaillés
  createDetail(request: EncaissementQuittanceDetailRequest): Observable<EncaissementQuittanceDetailResponse> {
    return this.http.post<EncaissementQuittanceDetailResponse>(
      `${this.baseUrl}/encaissement-quittance-detail`, request
    );
  }

  updateDetail(uuid: string, request: EncaissementQuittanceDetailRequest): Observable<EncaissementQuittanceDetailResponse> {
    return this.http.put<EncaissementQuittanceDetailResponse>(
      `${this.baseUrl}/encaissement-quittance-detail/${uuid}`, request
    );
  }

  delete(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/encaissement-quittance/${uuid}`);
  }
}
```

#### QuittanceStatementService (Extension)
```typescript
@Injectable()
export class QuittanceStatementService {
  
  // États des quittances d'encaissement
  getEncaissementStatement(params: {
    companyUuid: string;
    startDate?: string;
    endDate?: string;
    month?: number;
    year?: number;
  }): Observable<QuittanceStatementSummary> {
    const endpoint = params.month && params.year ? 'monthly' : '';
    const queryParams = this.buildQueryParams(params);
    
    return this.http.get<QuittanceStatementSummary>(
      `${this.baseUrl}/quittance-statements/encaissement/${endpoint}?${queryParams}`
    );
  }

  getEncaissementStatementPdf(params: any): Observable<Blob> {
    const endpoint = params.month && params.year ? 'monthly/pdf' : 'pdf';
    const queryParams = this.buildQueryParams(params);
    
    return this.http.get(
      `${this.baseUrl}/quittance-statements/encaissement/${endpoint}?${queryParams}`,
      { responseType: 'blob' }
    );
  }

  // États des règlements (similaire)
  getReglementStatement(params: any): Observable<QuittanceStatementSummary> { /* ... */ }
  getReglementStatementPdf(params: any): Observable<Blob> { /* ... */ }

  // États des encaissements
  getEncaissementsStatement(params: any): Observable<EncaissementStatementSummary> { /* ... */ }
  getEncaissementsStatementPdf(params: any): Observable<Blob> { /* ... */ }

  private buildQueryParams(params: any): string {
    return Object.keys(params)
      .filter(key => params[key] !== undefined && params[key] !== null)
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');
  }
}
```

### 4. Nouveau Component : QuittanceStatementsComponent

```typescript
@Component({
  selector: 'app-quittance-statements',
  template: `
    <div class="statements-container">
      <h2>États et Rapports des Quittances</h2>

      <!-- Filtres -->
      <mat-card class="filter-card">
        <mat-card-header>
          <mat-card-title>Filtres</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="filterForm" class="filter-form">
            <mat-form-field>
              <mat-label>Compagnie</mat-label>
              <mat-select formControlName="companyUuid" required>
                <mat-option *ngFor="let company of companies" [value]="company.uuid">
                  {{ company.name }} ({{ company.acronym }})
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-radio-group formControlName="periodType">
              <mat-radio-button value="monthly">Mensuel</mat-radio-button>
              <mat-radio-button value="custom">Période personnalisée</mat-radio-button>
            </mat-radio-group>

            <!-- Filtres mensuels -->
            <div *ngIf="filterForm.get('periodType')?.value === 'monthly'" class="monthly-filters">
              <mat-form-field>
                <mat-label>Mois</mat-label>
                <mat-select formControlName="month">
                  <mat-option *ngFor="let month of months" [value]="month.value">
                    {{ month.label }}
                  </mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field>
                <mat-label>Année</mat-label>
                <mat-select formControlName="year">
                  <mat-option *ngFor="let year of years" [value]="year">
                    {{ year }}
                  </mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <!-- Filtres période personnalisée -->
            <div *ngIf="filterForm.get('periodType')?.value === 'custom'" class="custom-filters">
              <mat-form-field>
                <mat-label>Date de début</mat-label>
                <input matInput [matDatepicker]="startPicker" formControlName="startDate">
                <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
                <mat-datepicker #startPicker></mat-datepicker>
              </mat-form-field>

              <mat-form-field>
                <mat-label>Date de fin</mat-label>
                <input matInput [matDatepicker]="endPicker" formControlName="endDate">
                <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
                <mat-datepicker #endPicker></mat-datepicker>
              </mat-form-field>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      <!-- Boutons d'actions -->
      <div class="action-buttons">
        <button mat-raised-button color="primary" (click)="generateEncaissementStatement()" 
                [disabled]="!filterForm.valid || loading">
          <mat-icon>assessment</mat-icon>
          État Encaissement
        </button>

        <button mat-raised-button color="primary" (click)="generateReglementStatement()" 
                [disabled]="!filterForm.valid || loading">
          <mat-icon>assessment</mat-icon>
          État Règlement
        </button>

        <button mat-raised-button color="primary" (click)="generateEncaissementsStatement()" 
                [disabled]="!filterForm.valid || loading">
          <mat-icon>list</mat-icon>
          État des Encaissements
        </button>

        <button mat-raised-button color="accent" (click)="downloadPdf()" 
                [disabled]="!currentStatement || loading">
          <mat-icon>download</mat-icon>
          Télécharger PDF
        </button>
      </div>

      <!-- Affichage des résultats -->
      <div *ngIf="currentStatement" class="statement-results">
        <mat-card>
          <mat-card-header>
            <mat-card-title>{{ currentStatement.companyName }}</mat-card-title>
            <mat-card-subtitle>{{ currentStatement.period }}</mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <!-- Résumé -->
            <div class="summary-section">
              <h3>Résumé</h3>
              <div class="summary-grid">
                <div class="summary-item">
                  <span class="label">Nombre de quittances:</span>
                  <span class="value">{{ currentStatement.nombreQuittances }}</span>
                </div>
                <div class="summary-item">
                  <span class="label">Total montant quittances:</span>
                  <span class="value amount">{{ currentStatement.totalMontantQuittances | currency:'XOF' }}</span>
                </div>
                <div *ngIf="currentStatement.nombreEncaissements !== undefined" class="summary-item">
                  <span class="label">Nombre d'encaissements:</span>
                  <span class="value">{{ currentStatement.nombreEncaissements }}</span>
                </div>
                <div *ngIf="currentStatement.totalMontantEncaisse !== undefined" class="summary-item">
                  <span class="label">Total encaissé:</span>
                  <span class="value amount">{{ currentStatement.totalMontantEncaisse | currency:'XOF' }}</span>
                </div>
              </div>
            </div>

            <!-- Tableau détaillé -->
            <div class="details-section">
              <h3>Détails</h3>
              <table mat-table [dataSource]="currentStatement.quittanceLines || currentStatement.encaissementLines" 
                     class="statement-table">
                
                <!-- Colonnes communes -->
                <ng-container matColumnDef="numero">
                  <th mat-header-cell *matHeaderCellDef>N° Quittance</th>
                  <td mat-cell *matCellDef="let line">{{ line.quittanceNumero || line.encaissementNumero }}</td>
                </ng-container>

                <ng-container matColumnDef="montant">
                  <th mat-header-cell *matHeaderCellDef>Montant</th>
                  <td mat-cell *matCellDef="let line">
                    {{ (line.montantQuittance || line.montantEncaissement) | currency:'XOF' }}
                  </td>
                </ng-container>

                <ng-container matColumnDef="date">
                  <th mat-header-cell *matHeaderCellDef>Date</th>
                  <td mat-cell *matCellDef="let line">
                    {{ (line.dateSortQuittance || line.dateEncaissement) | date:'dd/MM/yyyy' }}
                  </td>
                </ng-container>

                <!-- Colonnes spécifiques aux encaissements -->
                <ng-container matColumnDef="nombreEncaissements" *ngIf="isQuittanceStatement">
                  <th mat-header-cell *matHeaderCellDef>Nb Encaissements</th>
                  <td mat-cell *matCellDef="let line">{{ line.nombreEncaissements }}</td>
                </ng-container>

                <ng-container matColumnDef="typeEncaissement" *ngIf="isEncaissementStatement">
                  <th mat-header-cell *matHeaderCellDef>Type</th>
                  <td mat-cell *matCellDef="let line">
                    <mat-chip [color]="line.typeEncaissement === 'GLOBAL' ? 'primary' : 'accent'" selected>
                      {{ line.typeEncaissement }}
                    </mat-chip>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              </table>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `
})
export class QuittanceStatementsComponent implements OnInit {
  // Implementation...
}
```

### 5. Routing et Navigation

#### Ajout dans app-routing.module.ts :
```typescript
const routes: Routes = [
  // Routes existantes...
  {
    path: 'encaissements',
    children: [
      { path: '', component: QuittanceListComponent }, // Liste avec encaissements
      { path: 'statements', component: QuittanceStatementsComponent }, // États et rapports
    ]
  }
];
```

#### Mise à jour du menu de navigation :
```typescript
export const MENU_ITEMS = [
  // Items existants...
  {
    id: 'encaissements',
    label: 'Encaissements',
    icon: 'account_balance_wallet',
    children: [
      { id: 'quittances', label: 'Gestion des Quittances', route: '/encaissements' },
      { id: 'statements', label: 'États et Rapports', route: '/encaissements/statements' }
    ]
  }
];
```

## Formatage et Affichage

### 1. Formatage des Montants
```typescript
// Utiliser le pipe currency avec XOF
{{ montant | currency:'XOF':'symbol':'1.2-2':'fr-SN' }}

// Custom pipe pour format CFA
@Pipe({ name: 'cfaFormat' })
export class CfaFormatPipe implements PipeTransform {
  transform(value: number): string {
    if (value == null) return '0,00 CFA';
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value) + ' CFA';
  }
}
```

### 2. Indicateurs Visuels
```scss
// Badges de statut
.statut-encaisse { background-color: #4caf50; color: white; }
.statut-partiel { background-color: #ff9800; color: white; }
.statut-non-encaisse { background-color: #f44336; color: white; }

// Montants
.amount {
  font-weight: bold;
  color: #2c5aa0;
}

.amount.negative {
  color: #f44336;
}

// Progress bars pour les encaissements partiels
.encaissement-progress {
  .mat-progress-bar-fill::after {
    background-color: #4caf50;
  }
}
```

## Validation et Gestion d'Erreurs

### 1. Validations côté Frontend
```typescript
// Validation des montants d'encaissement
export const ENCAISSEMENT_VALIDATORS = {
  montant: [
    Validators.required,
    Validators.min(0.01),
    // Validation custom pour ne pas dépasser le solde
    (control: AbstractControl) => {
      const montant = control.value;
      const soldeDisponible = control.parent?.get('soldeDisponible')?.value;
      return montant > soldeDisponible ? { depassementSolde: true } : null;
    }
  ],
  numero: [
    Validators.required,
    Validators.pattern(/^[A-Z0-9-]+$/) // Format numéro d'encaissement
  ],
  dateEncaissement: [
    Validators.required,
    // Ne pas être dans le futur
    (control: AbstractControl) => {
      const date = new Date(control.value);
      return date > new Date() ? { dateFuture: true } : null;
    }
  ]
};
```

### 2. Messages d'Erreur
```typescript
export const ENCAISSEMENT_ERROR_MESSAGES = {
  'montant.required': 'Le montant est obligatoire',
  'montant.min': 'Le montant doit être supérieur à 0',
  'montant.depassementSolde': 'Le montant ne peut pas dépasser le solde disponible',
  'numero.required': 'Le numéro d\'encaissement est obligatoire',
  'numero.pattern': 'Format de numéro invalide',
  'dateEncaissement.required': 'La date d\'encaissement est obligatoire',
  'dateEncaissement.dateFuture': 'La date ne peut pas être dans le futur'
};
```

## Tests et Mocking

### 1. Services Mock pour les Tests
```typescript
@Injectable()
export class MockEncaissementQuittanceService {
  getAll(): Observable<EncaissementQuittanceResponse[]> {
    return of(MOCK_ENCAISSEMENTS);
  }

  createGlobal(request: any): Observable<any> {
    return of({ ...request, uuid: 'mock-uuid-' + Date.now() });
  }
  // Autres méthodes mockées...
}

export const MOCK_ENCAISSEMENTS = [
  {
    uuid: 'enc-1',
    numero: 'ENC001',
    montant: 150000,
    date: '2024-01-15T10:30:00',
    quittance: {
      uuid: 'quit-1',
      numero: 'Q001',
      montant: 200000,
      nature: 'ENCAISSEMENT'
    }
  }
  // Plus de données de test...
];
```

## Performance et Optimisation

### 1. Lazy Loading
```typescript
// Chargement différé du module encaissements
const routes: Routes = [
  {
    path: 'encaissements',
    loadChildren: () => import('./encaissements/encaissements.module').then(m => m.EncaissementsModule)
  }
];
```

### 2. Pagination et Filtrage
```typescript
// Paramètres de pagination pour les gros volumes
export interface EncaissementSearchParams {
  page: number;
  size: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  companyUuid?: string;
  startDate?: string;
  endDate?: string;
  minMontant?: number;
  maxMontant?: number;
}
```

Ce guide fournit une base complète pour intégrer les fonctionnalités d'encaissement dans l'interface existante, en réutilisant les composants et patterns déjà établis dans le système.