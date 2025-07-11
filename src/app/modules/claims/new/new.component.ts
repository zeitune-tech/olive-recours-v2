import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClaimService } from '@core/services/claim/claim.service';
import { Company } from '@core/services/company/company.interface';
import { CompanyService } from '@core/services/company/company.service';
import { LayoutService } from '@lhacksrt/services/layout/layout.service';

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

	constructor(
		private _fb: FormBuilder,
		private _claimService: ClaimService,
		private _companyService: CompanyService,
		private _layoutService: LayoutService,
		private _router: Router
	) {
		// Step 1
		this.step1Group = this._fb.group({
			dateOfSinister: ['', Validators.required],
			claimNumber: ['', Validators.required],
			insuredName: ['', Validators.required]
		});

		// Step 2
		this.step2Group = this._fb.group({
			opponentCompanyId: ['', Validators.required],
			opponentClaimNumber: ['', Validators.required],
			opponentInsuredName: ['', Validators.required]
		});

		// Step 3
		this.step3Group = this._fb.group({
			amount: [0, [Validators.required, Validators.min(1)]],
			insuredAmount: [0, [Validators.required, Validators.min(1)]],
			comment: ['']
		});

		// Form global
		this.claimForm = this._fb.group({
			step1Group: this.step1Group,
			step2Group: this.step2Group,
			step3Group: this.step3Group
		});
	}
	ngOnInit(): void {

		this._layoutService.setPageTitle('Création d\'un recours');
		this._layoutService.setCrumbs([
			{ title: 'Liste des recours', link: '/claims/list', active: true },
			{ title: 'Création d\'un recours', link: '/claims/new', active: true }
		]);
		
		// Load companies for step 2
		this._companyService.companies$.subscribe({
			next: (companies) => {
				this.companies = companies;
			},
			error: (error) => {
				console.error('Erreur lors du chargement des entreprises', error);
			}
		});
	}

	createClaim(): void {
		console.log("submitting");
		if (this.isSubmitting) return;
		
		// Construction payload final
		const payload = {
			dateOfSinister: this.step1Group.value.dateOfSinister,
			claimNumber: this.step1Group.value.claimNumber,
			insuredName: this.step1Group.value.insuredName,
			opponentCompanyId: this.step2Group.value.opponentCompanyId,
			opponentClaimNumber: this.step2Group.value.opponentClaimNumber,
			opponentInsuredName: this.step2Group.value.opponentInsuredName,
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
				this._router.navigate(['/claims/list']);
			},
			error: () => {
				this.isSubmitting = false;
				// TODO: afficher un snackbar ou message d'erreur
				console.error('Erreur lors de la création du recours');
			}
		});
	}
}