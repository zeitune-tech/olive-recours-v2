import { Component, OnInit } from "@angular/core";
import { Claim } from "@core/services/claim/claim.interface";
import { ClaimService } from "@core/services/claim/claim.service";
import { TranslocoService } from "@jsverse/transloco";
import { ToastService } from "src/app/components/toast/toast.service";

@Component({
    selector: "app-claim-details-informations",
    templateUrl: "./details-informations.component.html",
})
export class DetailsInformationsComponent implements OnInit {


    editMode = false;
    claim!: Claim;


    constructor(
        private _claimService: ClaimService,
        private transloco: TranslocoService,
        private _toastService: ToastService
    ) {
        // Adaptation de la garantie à une seule valeur pour l'affichage
        this._claimService.claim$.subscribe((claim: Claim) => {
            let garanti = '';
            if (Array.isArray(claim.garantiMiseEnOeuvre) && claim.garantiMiseEnOeuvre.length === 1) {
                garanti = claim.garantiMiseEnOeuvre[0];
            }
            this.claim = {
                ...claim,
                garantiMiseEnOeuvre: garanti
            };
        });
    }

    ngOnInit(): void {
        // Component initialization logic can go here
    }

    saveClaim() {
        // On prépare la donnée à envoyer
        const toSave = {
            ...this.claim,
            garantiMiseEnOeuvre: Array.isArray(this.claim.garantiMiseEnOeuvre) ? this.claim.garantiMiseEnOeuvre : this.claim.garantiMiseEnOeuvre ? this.claim.garantiMiseEnOeuvre : []
        };
        this._claimService.update(this.claim.id, toSave).subscribe((claim: Claim) => {
            let garanti = '';
            if (Array.isArray(claim.garantiMiseEnOeuvre) && claim.garantiMiseEnOeuvre.length === 1) {
                garanti = claim.garantiMiseEnOeuvre[0];
            }
            this.claim = {
                ...claim,
                garantiMiseEnOeuvre: garanti
            };
            this.editMode = false;
            this._toastService.success(this.transloco.translate('messages.claim.update-success'));
        });
    }

}