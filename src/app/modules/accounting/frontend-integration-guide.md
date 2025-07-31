# Guide d'Intégration Frontend Angular - Système de Gestion des Quittances et Encaissements

## Vue d'ensemble du Système

Ce backend Spring Boot fournit une API complète pour la gestion des quittances d'assurance, des encaissements et des paiements, avec génération d'états PDF.

## Nouvelles Entités Créées

### 1. Paiement
- **Champs** : `montant`, `dateEncaissement`, `modeEncaissement`
- **Relations** : Associé aux encaissements détaillés

### 2. EncaissementQuittance (Classe abstraite)
- **Héritage** : Stratégie JOINED avec discriminateur
- **Champs communs** : `id`, `uuid`, `numero`, `quittance`
- **Méthodes abstraites** : `getMontant()`, `getDate()`

### 3. EncaissementQuittanceGlobal
- **Relation** : OneToOne avec Paiement
- **Usage** : Encaissement unique pour une quittance

### 4. EncaissementQuittanceDetail  
- **Relation** : OneToMany avec liste de Paiements
- **Usage** : Encaissement multiple avec détail des paiements

## API Endpoints Disponibles

### Gestion des Encaissements de Quittances
- `GET /app/encaissement-quittances` - Liste paginée
- `GET /app/encaissement-quittances/{uuid}` - Détails par UUID
- `POST /app/encaissement-quittances` - Création
- `PUT /app/encaissement-quittances/{uuid}` - Mise à jour
- `DELETE /app/encaissement-quittances/{uuid}` - Suppression

### Gestion des Paiements
- `GET /app/paiements` - Liste paginée
- `GET /app/paiements/{uuid}` - Détails par UUID
- `POST /app/paiements` - Création
- `PUT /app/paiements/{uuid}` - Mise à jour
- `DELETE /app/paiements/{uuid}` - Suppression

### États et Rapports - QuittanceStatementController

#### États des Quittances d'Encaissement
- `GET /app/quittance-statements/encaissement` - État JSON par période
- `GET /app/quittance-statements/encaissement/monthly` - État JSON mensuel
- `GET /app/quittance-statements/encaissement/pdf` - État PDF par période
- `GET /app/quittance-statements/encaissement/monthly/pdf` - État PDF mensuel

#### États des Quittances de Règlement
- `GET /app/quittance-statements/reglement` - État JSON par période
- `GET /app/quittance-statements/reglement/monthly` - État JSON mensuel
- `GET /app/quittance-statements/reglement/pdf` - État PDF par période
- `GET /app/quittance-statements/reglement/monthly/pdf` - État PDF mensuel

#### États des Encaissements
- `GET /app/quittance-statements/encaissements` - État JSON par période
- `GET /app/quittance-statements/encaissements/monthly` - État JSON mensuel
- `GET /app/quittance-statements/encaissements/pdf` - État PDF par période
- `GET /app/quittance-statements/encaissements/monthly/pdf` - État PDF mensuel

## Paramètres des Endpoints d'États

### Paramètres par Période
- `companyUuid` : UUID de la compagnie
- `startDate` : Date de début (ISO DateTime)
- `endDate` : Date de fin (ISO DateTime)

### Paramètres Mensuels
- `companyUuid` : UUID de la compagnie
- `month` : Mois (1-12)
- `year` : Année

## Structures de Données (DTOs)

### QuittanceStatementSummary
```typescript
interface QuittanceStatementSummary {
  companyUuid: string;
  companyName: string;
  companyCode: string;
  nature: 'ENCAISSEMENT' | 'REGLEMENT';
  period: string;
  nombreQuittances: number;
  totalMontantQuittances: number;
  generationDate: string;
  generatedBy: string;
  quittanceLines: QuittanceStatementLine[];
}
```

### QuittanceStatementLine
```typescript
interface QuittanceStatementLine {
  quittanceUuid: string;
  quittanceNumero: string;
  montantQuittance: number;
  dateSortQuittance: string;
  claimNumero?: string;
  claimReference?: string;
  nombreEncaissements: number;
  totalMontantEncaisse: number;
}
```

### EncaissementStatementSummary
```typescript
interface EncaissementStatementSummary {
  companyUuid: string;
  companyName: string;
  companyCode: string;
  period: string;
  nombreEncaissementsGlobaux: number;
  nombreEncaissementsDetails: number;
  nombreTotalEncaissements: number;
  nombreQuittancesAssociees: number;
  totalMontantEncaissements: number;
  totalMontantQuittancesAssociees: number;
  generationDate: string;
  generatedBy: string;
  encaissementLines: EncaissementStatementLine[];
}
```

### EncaissementStatementLine
```typescript
interface EncaissementStatementLine {
  encaissementUuid: string;
  encaissementNumero: string;
  typeEncaissement: 'GLOBAL' | 'DETAIL';
  dateEncaissement: string;
  montantEncaissement: number;
  quittanceUuid?: string;
  quittanceNumero?: string;
  montantQuittance?: number;
  dateSortQuittance?: string;
  claimNumero?: string;
  claimReference?: string;
  modeEncaissement?: string;
  paiementDetails?: PaiementDetail[];
}
```

### PaiementDetail
```typescript
interface PaiementDetail {
  uuid: string;
  montant: number;
  dateEncaissement: string;
  modeEncaissement: string;
}
```

## Énumérations

### NatureQuittance
- `ENCAISSEMENT` - Quittance d'encaissement
- `REGLEMENT` - Quittance de règlement

### ModeEncaissement
- Valeurs définies selon le contexte métier (Chèque, Virement, Espèces, etc.)

## Authentication & Sécurité

- **JWT Bearer Token** requis pour tous les endpoints
- L'utilisateur authentifié est automatiquement récupéré depuis le token
- Permissions basées sur les rôles utilisateur

## Gestion des Erreurs

### Codes de Réponse
- `200 OK` - Succès
- `201 Created` - Création réussie
- `400 Bad Request` - Données invalides
- `401 Unauthorized` - Non authentifié
- `403 Forbidden` - Permissions insuffisantes
- `404 Not Found` - Ressource non trouvée
- `500 Internal Server Error` - Erreur serveur

## Recommandations Frontend

### 1. Composants à Créer
- **QuittanceListComponent** - Liste des quittances avec filtres
- **EncaissementFormComponent** - Formulaire création/édition encaissement
- **PaiementFormComponent** - Formulaire gestion des paiements
- **StatementViewComponent** - Affichage des états avec options d'export
- **ReportFiltersComponent** - Filtres pour la génération d'états

### 2. Services Angular
```typescript
@Injectable()
export class QuittanceStatementService {
  // Méthodes pour tous les endpoints d'états
  getEncaissementStatement(params: any): Observable<QuittanceStatementSummary>
  getEncaissementStatementPdf(params: any): Observable<Blob>
  // etc.
}

@Injectable()
export class EncaissementQuittanceService {
  // CRUD operations
}

@Injectable()
export class PaiementService {
  // CRUD operations
}
```

### 3. Gestion des PDF
- Utiliser `responseType: 'blob'` pour les endpoints PDF
- Implémenter le téléchargement automatique des fichiers PDF
- Gestion des noms de fichiers depuis les headers `Content-Disposition`

### 4. Filtres et Recherche
- Filtres par compagnie, période, nature de quittance
- Recherche par numéro de quittance, numéro de recours
- Pagination des résultats

### 5. Validation Frontend
- Validation des montants (nombres positifs)
- Validation des dates (cohérence des périodes)
- Validation des UUID de compagnie

### 6. UX/UI Recommandations
- Tableaux avec tri et pagination
- Boutons d'export PDF avec indicateur de chargement
- Formulaires avec validation en temps réel
- Confirmations pour les suppressions
- Toast notifications pour les actions

## Format des Dates

- **ISO DateTime** pour les paramètres d'API : `2024-01-15T10:30:00`
- **Date locale** pour l'affichage : `15/01/2024`

## Base de Données

- **PostgreSQL** avec Hibernate/JPA
- **Stratégie d'héritage** : JOINED avec discriminateur
- **IDs** : UUID + auto-increment pour performance
- **Transactions** : Gérées automatiquement par Spring

Ce système fournit une base complète pour la gestion des quittances d'assurance avec fonctionnalités avancées de reporting et d'export PDF.