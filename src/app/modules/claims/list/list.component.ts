import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { UntypedFormControl } from "@angular/forms";
import { Claim } from "@core/services/claim/claim.interface";
import { ClaimService } from "@core/services/claim/claim.service";
import { Subject, takeUntil } from "rxjs";
import { animations } from "@lhacksrt/animations";
import { SelectionModel } from "@angular/cdk/collections";
import { TableOptions, TableColumn } from "@lhacksrt/components/table/table.interface";
import { LayoutService } from "@lhacksrt/services/layout/layout.service";
import { ClaimStatus } from "@core/services/claim/claim-status.enum";
import { ClaimNewComponent } from "../new/new.component";
import { MatDialog } from "@angular/material/dialog";
import { CompanyService } from "@core/services/company/company.service";
import { Company } from "@core/services/company/company.interface";
import { Router } from "@angular/router";
import { PermissionsService } from "@core/permissions/permissions.service";
import { User } from "@core/services/user/user.interface";
import { UserService } from "@core/services/user/user.service";
import { PERMISSIONS } from "@core/permissions/permissions.data";
import { ConfirmDialogComponent } from "@shared/components/confirm-dialog/confirm-dialog.component";
import { ToastService } from "src/app/components/toast/toast.service";
import { TranslocoService } from "@jsverse/transloco";

@Component({
    selector: "app-claims-list",
    templateUrl: "./list.component.html",
    animations: animations
})
export class ClaimsListComponent implements OnInit, OnDestroy {

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    tableOptions!: TableOptions<Claim>;

    // Pour les mat-header-row
    groupHeader: string[] = [];
    subHeader: string[] = [];
    visibleColumns: string[] = [];
    features: any = {
        view: false,
        accept: false,
        reject: false,
        delete: false,
        create: false,
    };

    dataSource = new MatTableDataSource<Claim>([]); // Ajoute les données réelles ici
    company: Company = {} as Company;

    constructor(
        private _claimService: ClaimService,
        private _companyService: CompanyService,
        private _layoutService: LayoutService,
        private _router: Router,
        private _dialog: MatDialog,
        private permissionsService: PermissionsService,
        private _userService: UserService,
        private _toastService: ToastService,
        private _translocoService: TranslocoService,
    ) {

        this._layoutService.setPageTitle(this._translocoService.translate('layout.titles.claims'));
    this._layoutService.setCrumbs([
      { title: this._translocoService.translate('layout.crumbs.claims'), link: '/claims', active: false },
      { title: this._translocoService.translate('layout.crumbs.claims-list'), link: '/claims', active: true }
    ]);

        this._claimService.claims$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: Claim[]) => {
                this.data = data;
                this.dataSource.data = data;
                this.filteredClaims = data;
            });

        this._companyService.myCompany$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((company: Company) => {
                this.company = company;
            });

        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.features = {
                    view: this.permissionsService.hasPermission(user, [PERMISSIONS.READ_CLAIM, PERMISSIONS.ALL]),
                    accept: this.permissionsService.hasPermission(user, [PERMISSIONS.VALIDATE_CLAIMS, PERMISSIONS.ALL]),
                    reject: this.permissionsService.hasPermission(user, [PERMISSIONS.VALIDATE_CLAIMS, PERMISSIONS.ALL]),
                    delete: this.permissionsService.hasPermission(user, [PERMISSIONS.DELETE_CLAIM, PERMISSIONS.ALL]),
                    create: this.permissionsService.hasPermission(user, [PERMISSIONS.CREATE_CLAIM, PERMISSIONS.ALL]),
                }
            });

        

    }


    data: Claim[] = [];
    filteredClaims: Claim[] = [];
    searchTerm: string = '';

    @ViewChild(MatSort) sort!: MatSort;

    selection = new SelectionModel<Claim>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();



    ngOnInit(): void {
        // Initialisation de la configuration de la table
        this.tableOptions = {
            title: '',
            columns: [
                { property: 'dateOfSinister', type: 'text', label: 'Date Sinistre' },
                {
                    property: 'claimNumber', type: 'collapse', label: 'Déclarant', collapseOptions: [
                        { property: 'claimNumber', type: 'text', label: 'Num Sinistre' },
                        { property: 'insuredName', type: 'text', label: 'Assuré', cssClasses: ['text-sm','min-w-32'] },
                        { property: 'declaringCompanyName', type: 'text', label: 'Compagnie', cssClasses: ['text-sm','min-w-32'] },
                    ]
                },
                {
                    property: 'opponentClaimNumber', type: 'collapse', label: 'Adversaire', collapseOptions: [
                        { property: 'opponentClaimNumber', type: 'text', label: 'Num Sinistre' },
                        { property: 'opponentInsuredName', type: 'text', label: 'Assuré', cssClasses: ['text-sm','min-w-32'] },
                        { property: 'opponentCompanyName', type: 'text', label: 'Compagnie', cssClasses: ['text-sm','min-w-32'] },
                    ]
                },
                { property: 'amount', type: 'text', label: 'P/C Compagnie' },
                { property: 'insuredAmount', type: 'text', label: 'P/C Assuré' },
                { property: 'status', type: 'badge', label: 'Statut', }

            ],
            pageSize: 8,
            pageSizeOptions: [5, 6, 8],
            actions: [],
            renderItem: (element: Claim, property: keyof Claim) => {

                if (property === 'status') {
                    switch (element.status) {
                        case ClaimStatus.PENDING:
                            return 'Soumis';
                        case ClaimStatus.ACCEPTED:
                            return 'Accepté';
                        case ClaimStatus.REFUSED:
                            return 'Rejeté';
                        default:
                            return 'Statut inconnu';
                    }
                }

                return element[property] ?? '--';
            },
        };

        // Construction des lignes d’en-tête
        this.buildHeaderRows();

        // Initialiser filteredClaims
        this.filteredClaims = this.data;
    }

    getBadgeClass(status: ClaimStatus): string {
        switch (status) {
            case ClaimStatus.PENDING:
                return 'bg-blue-100 text-blue-800';
            case ClaimStatus.ACCEPTED:
                return 'bg-green-100 text-green-800';
            case ClaimStatus.REFUSED:
                return 'bg-red-100 text-red-800';
            case ClaimStatus.CANCELED:
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    buildHeaderRows(): void {
        this.tableOptions.columns.forEach(col => {
            if (col.type === 'collapse' && col.collapseOptions?.length) {
                // En-tête parent (ligne 1)
                const parent = col.property as string + '-parent';
                this.groupHeader.push(parent);

                // Sous-colonnes (ligne 2)
                col.collapseOptions.forEach(child => {
                    this.subHeader.push(child.property as string);
                    this.visibleColumns.push(child.property as string);
                });
            } else {
                // Colonne simple (même valeur dans les 2 lignes)
                this.groupHeader.push(col.property as string);

                this.visibleColumns.push(col.property as string);
            }
        });

        // Ajout de la colonne d’actions si nécessaire
        this.groupHeader.push('actions');
        this.visibleColumns.push('actions');
    }

    // Ajout de la méthode de recherche/filtrage
    onSearch(): void {
        const term = this.searchTerm.trim().toLowerCase();
        if (!term) {
            this.filteredClaims = this.data;
            return;
        }
        this.filteredClaims = this.data.filter(claim =>
            (claim.claimNumber && claim.claimNumber.toLowerCase().includes(term)) ||
            (claim.insuredName && claim.insuredName.toLowerCase().includes(term)) ||
            (claim.declaringCompanyName && claim.declaringCompanyName.toLowerCase().includes(term)) ||
            (claim.opponentClaimNumber && claim.opponentClaimNumber.toLowerCase().includes(term)) ||
            (claim.opponentInsuredName && claim.opponentInsuredName.toLowerCase().includes(term)) ||
            (claim.opponentCompanyName && claim.opponentCompanyName.toLowerCase().includes(term)) ||
            (claim.amount && claim.amount.toString().toLowerCase().includes(term)) ||
            (claim.insuredAmount && claim.insuredAmount.toString().toLowerCase().includes(term))
        );
    }


    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    acceptClaim(claim: Claim): void {
        // if(this.company.uuid === claim.declaringCompanyId){
        //     this._toastService.error(
        //         //TODO : traduire
        //         "Vous ne pouvez pas accepter votre propre recours"
        //     );
        //     return;
        // }
        const dialogRef = this._dialog.open(ConfirmDialogComponent, {
            data: {
                title: 'Confirmation',
                description: 'Validation du recours',
                message: "Confirmer l'acceptation de ce recours ?",
                showDateInput: true
            }
        });
        dialogRef.afterClosed().subscribe((result: { date?: string } | undefined) => {
            if (result) {
                const payload = result.date ? { status: ClaimStatus.ACCEPTED, date: result.date } : ClaimStatus.ACCEPTED;
                this._claimService.updateStatus(claim.id!, payload)
                    .subscribe({
                        next: () => {
                            this.loadClaims();
                            this._toastService.success(
                                this._translocoService.translate('messages.claim.accepted_success')
                            );
                        },
                        error: (err) => {
                            const errorKey = 'errors.closure.accept-claim';
                            this._toastService.error(
                                this._translocoService.translate(errorKey)
                            );
                        }
                    });
            }
        });
    }

    rejectClaim(claim: Claim) {
        if(this.company.uuid === claim.declaringCompanyId){
            this._toastService.error(
                //TODO : traduire
                "Vous ne pouvez pas rejeter votre propre recours"
            );
            return;
        }
        const dialogRef = this._dialog.open(ConfirmDialogComponent, {
            data: {
                title: 'Confirmation',
                description: 'Rejet du recours',
                message: "Confirmer le rejet de ce recours ?",
                showDateInput: false
            }
        });
        dialogRef.afterClosed().subscribe((result: any) => {
            if (result !== undefined) {
                this._claimService.updateStatus(claim.id!, ClaimStatus.REFUSED)
                    .subscribe(() => {
                        this.loadClaims();
                    });
            }
        });
    }

    openNewClaimDialog(): void {
        this._router.navigateByUrl("/claims/new");
    }

    onEdit(claim: Claim): void {
        console.log("Éditer recours :", claim);
        // À compléter : ouvrir dialog en mode édition
    }

    onDelete(claim: Claim): void {
        const dialogRef = this._dialog.open(ConfirmDialogComponent, {
            data: {
                title: 'Confirmation',
                description: 'Suppression du recours',
                message: "Confirmer la suppression de ce recours ?",
                showDateInput: false
            }
        });
        dialogRef.afterClosed().subscribe((result: any) => {
            if (result !== undefined) {
                this._claimService.delete(claim.id!)
                    .subscribe(() => {
                        this.loadClaims();
                    });
            }
        });
    }

    onView(claim: Claim): void {
        console.log("Voir recours :", claim);
        // À compléter : ouvrir dialog en mode vue détaillée
        this._claimService.claim = claim;
        this._router.navigate(['/claims/list', claim.id]);
    }

    onButtonClick(claim: Claim, column: string): void {
        if (column === 'claimionRegistry') {
        }
    }


    loadClaims(): void {
        this._claimService.getAll().subscribe(claims => {
            this.dataSource.data = claims;
            this.data = claims;
            this.filteredClaims = claims;
        });
    }


    trackByProperty(index: number, column: TableColumn<Claim>) {
        return column.property;
    }
}
