import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { ClaimService } from '@core/services/claim/claim.service';
import { Company } from '@core/services/company/company.interface';
import { CompanyService } from '@core/services/company/company.service';
import { ManagementEntity } from '@core/services/management-entity/management-entity.interface';
import { UserService } from '@core/services/user/user.service';
import { TranslocoService } from '@jsverse/transloco';
import { LayoutService } from '@lhacksrt/services/layout/layout.service';
import { ToastService } from 'src/app/components/toast/toast.service';
import { GarantiMiseEnOeuvre } from '../claim.dto';

@Component({
	selector: 'app-claim-new-dialog',
	templateUrl: './new.component.html'
})
export class ClaimNewComponent implements OnInit {
	claimForm: FormGroup;
	step1Group: FormGroup;
	step2Group: FormGroup;
	step3Group: FormGroup;

	isSubmitting = false;
	companies: Company[] = [];
	managementEntity: ManagementEntity = {} as ManagementEntity;
	displayAmount = '';
	displayInsuredAmount = '';

	GarantiMiseEnOeuvre = GarantiMiseEnOeuvre;

	getGarantiOptions(): string[] {
		return Object.values(GarantiMiseEnOeuvre);
	}

	getGarantiLabel(value: string): string {
		switch (value) {
			case GarantiMiseEnOeuvre.TierceComplete:
				return 'entities.claim.garanti.tierce_complete';
			case GarantiMiseEnOeuvre.TierceCollision:
				return 'entities.claim.garanti.tierce_collision';
			case GarantiMiseEnOeuvre.TiercePlafonnee:
				return 'entities.claim.garanti.tierce_plafonnee';
			case GarantiMiseEnOeuvre.AvanceRecours:
				return 'entities.claim.garanti.avance_recours';
			case GarantiMiseEnOeuvre.BrisDeGlace:
				return 'entities.claim.garanti.bris_de_glace';
			case GarantiMiseEnOeuvre.Incendie:
				return 'entities.claim.garanti.incendie';
			case GarantiMiseEnOeuvre.RcCorporelle:
				return 'entities.claim.garanti.rc_corporelle';
			case GarantiMiseEnOeuvre.Autres:
				return 'entities.claim.garanti.autres';
			default:
				return value;
		}
	}

	constructor(
		private _fb: FormBuilder,
		private _claimService: ClaimService,
		private _companyService: CompanyService,
		private _layoutService: LayoutService,
		private transloco: TranslocoService,
		private _userService: UserService,
		private _router: Router,
		private _toastService: ToastService
	) {
		// Step 1
		this.step1Group = this._fb.group({
			dateOfSinister: ['', Validators.required],
			claimNumber: ['', Validators.required],
			insuredName: ['', Validators.required],
			natureOfSinister: ['', Validators.required],
			immatriculationDeclarant: ['', Validators.required],
			garantiMiseEnOeuvre: [[], Validators.required]
		});

		// Step 2
		this.step2Group = this._fb.group({
			opponentCompanyId: ['', Validators.required],
			opponentClaimNumber: ['', Validators.required],
			opponentInsuredName: ['', Validators.required],
			immatriculationSubissant: ['', Validators.required]
		});

		// Step 3
		this.step3Group = this._fb.group({
			amount: [0],
			insuredAmount: [0],
			comment: ['']
		}, { validators: atLeastOneAmountValidator });

		// Form global
		this.claimForm = this._fb.group({
			step1Group: this.step1Group,
			step2Group: this.step2Group,
			step3Group: this.step3Group
		});
	}
	ngOnInit(): void {

		this._layoutService.setPageTitle(this.transloco.translate('layout.titles.claims'));
		this._layoutService.setCrumbs([
			{ title: this.transloco.translate('layout.crumbs.claims'), link: '/claims', active: true },
			{ title: this.transloco.translate('layout.crumbs.claims-new'), link: '/claims/new', active: true },
		]);

		this._userService.managementEntity$.subscribe({
			next: (managementEntity) => {
				this.managementEntity = managementEntity;
			},
			error: (error) => {
				console.error('Erreur lors du chargement de l\'entité de gestion', error);
			}
		});

		// Load companies for step 2
		this._companyService.companies$.subscribe({
			next: (companies) => {
				this.companies = companies.filter((company) => company.id !== this.managementEntity.id);
			},
			error: (error) => {
				console.error('Erreur lors du chargement des entreprises', error);
			}
		});

		// Initialize display values if needed (for edit mode or default)
		this.displayAmount = this.formatNumberWithSpaces(this.step3Group.value.amount?.toString() || '');
		this.displayInsuredAmount = this.formatNumberWithSpaces(this.step3Group.value.insuredAmount?.toString() || '');
	}

	createClaim(): void {
		console.log("submitting");
		if (this.isSubmitting) return;

		// Construction payload final
		const payload = {
			dateOfSinister: this.step1Group.value.dateOfSinister,
			claimNumber: this.step1Group.value.claimNumber,
			insuredName: this.step1Group.value.insuredName,
			natureOfSinister: this.step1Group.value.natureOfSinister,
			immatriculationDeclarant: this.step1Group.value.immatriculationDeclarant,
			garantiMiseEnOeuvre: this.step1Group.value.garantiMiseEnOeuvre,
			opponentCompanyId: this.step2Group.value.opponentCompanyId,
			opponentClaimNumber: this.step2Group.value.opponentClaimNumber,
			opponentInsuredName: this.step2Group.value.opponentInsuredName,
			immatriculationSubissant: this.step2Group.value.immatriculationSubissant,
			amount: this.step3Group.value.amount,
			insuredAmount: this.step3Group.value.insuredAmount,
			comment: this.step3Group.value.comment
		};

		console.log(payload);

		this.isSubmitting = true;
		this._claimService.create(payload).subscribe({
			next: () => {
				this.isSubmitting = false;
				// Redirection vers la liste après succès
				this._router.navigate(['/claims']);
				this._toastService.success(this.transloco.translate('claims.new.success'));
			},
			error: () => {
				this.isSubmitting = false;
				this._toastService.error(this.transloco.translate('claims.new.error'));
				console.error('Erreur lors de la création du recours');
			}
		});
	}

	// Ajoute cette méthode pour formater l'entrée utilisateur
	formatAmountInput(controlName: 'amount' | 'insuredAmount', group: FormGroup, event: any): void {
		let value = event.target.value.replace(/\s/g, '').replace(/[^0-9]/g, '');
		if (value) {
			value = parseInt(value, 10).toString();
			const formatted = this.formatNumberWithSpaces(value);
			event.target.value = formatted;
			group.get(controlName)?.setValue(Number(value), { emitEvent: false });
			if (controlName === 'amount') {
				this.displayAmount = formatted;
			} else {
				this.displayInsuredAmount = formatted;
			}
		} else {
			group.get(controlName)?.setValue(0, { emitEvent: false });
			if (controlName === 'amount') {
				this.displayAmount = '';
			} else {
				this.displayInsuredAmount = '';
			}
		}
	}

	formatNumberWithSpaces(value: string): string {
		return value.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
	}
}

// Validateur personnalisé : au moins un des deux montants doit être renseigné (>0)
function atLeastOneAmountValidator(group: AbstractControl): ValidationErrors | null {
	const amount = group.get('amount')?.value;
	const insuredAmount = group.get('insuredAmount')?.value;
	const isAmountValid = amount != null && amount > 0;
	const isInsuredAmountValid = insuredAmount != null && insuredAmount > 0;
	if (!isAmountValid && !isInsuredAmountValid) {
		return { atLeastOneAmount: true };
	}
	return null;
}