import { Component, OnInit } from "@angular/core";
import { Claim } from "@core/services/claim/claim.interface";
import { ClaimService } from "@core/services/claim/claim.service";

@Component({
    selector: "app-claim-details-informations",
    templateUrl: "./details-informations.component.html",
})
export class DetailsInformationsComponent implements OnInit {


    editMode = false;
    claim!: Claim;


    constructor(
        private _claimService: ClaimService
    ) {
        // Initialization logic can go here if needed
        this._claimService.claim$.subscribe((claim: Claim) => {
            this.claim = claim;
        });
    }

    ngOnInit(): void {
        // Component initialization logic can go here
    }

    saveClaim() {
        // TODO: call service to update
        console.log('Claim updated', this.claim);
        this.editMode = false;
    }

}