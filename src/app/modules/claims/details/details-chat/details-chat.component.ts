import { Component,  OnInit } from "@angular/core";
import { UntypedFormGroup, FormBuilder, Validators } from "@angular/forms";
import { ClaimMessage } from "@core/services/claim-message/claim-message.interface";
import { ClaimMessageService } from "@core/services/claim-message/claim-message.service";
import { Claim } from "@core/services/claim/claim.interface";
import { ClaimService } from "@core/services/claim/claim.service";

@Component({
    selector: "app-claim-details-chat",
    templateUrl: "./details-chat.component.html",
})

export class DetailsChatComponent  implements OnInit{
    formGroup!: UntypedFormGroup;
    messages: ClaimMessage[] = [];

    data!: Claim;

    constructor(
        private _formBuilder: FormBuilder,
        private _claimService: ClaimService,
        private _messageService: ClaimMessageService
    ) {

        // Initialize form group
        this.formGroup = this._formBuilder.group({
            content: [null, Validators.required]
        });

        // Load claim data from service
        this._claimService.claim$.subscribe((claims: Claim) => {
            this.data = claims;
            // Load messages for the claim
            this.loadMessages();
        });
    }

    ngOnInit(): void {
        this.formGroup = this._formBuilder.group({
            content: [null, Validators.required]
        });

    }

    loadMessages(): void {
        this._messageService.getByClaimUuid(this.data.id).subscribe(messages => {
            this.messages = messages;
            // Sort messages by creation date
            this.messages.sort((a, b) => {
                return new Date(b.messageDate).getTime() - new Date(a.messageDate).getTime();
            });
        });
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            const newMessage = {
                claimId: this.data.id,
                content: this.formGroup.value.content
            };

            this._messageService.create(newMessage).subscribe(() => {
                this.formGroup.reset();
                this.loadMessages();
            });
        }
    }

}
