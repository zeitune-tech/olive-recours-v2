import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Attachment } from '@core/services/attachement/attachment.interface';
import { AttachmentService } from '@core/services/attachement/attachment.service';
import { ClaimMessage } from '@core/services/claim-message/claim-message.interface';
import { ClaimMessageService } from '@core/services/claim-message/claim-message.service';
import { Claim } from '@core/services/claim/claim.interface';
import { ClaimService } from '@core/services/claim/claim.service';
import { TranslocoService } from '@jsverse/transloco';
import { LayoutService } from '@lhacksrt/services/layout/layout.service';

@Component({
    selector: 'app-claim-details',
    templateUrl: './details.component.html'
})
export class ClaimDetailsComponent implements OnInit {
    newMessage: string = '';
    claim: Claim = {} as Claim;
    attachments: Attachment[] = [];
    messages: ClaimMessage[] = [];

    constructor(
        private _route: ActivatedRoute,
        private _layoutService: LayoutService,
        private transloco: TranslocoService,
        private _claimService: ClaimService,
        private _attachmentService: AttachmentService,
        private _claimMessageService: ClaimMessageService
    ) {
        this._layoutService.setPageTitle(this.transloco.translate('layout.titles.claims'));
        this._layoutService.setCrumbs([
            { title: this.transloco.translate('layout.crumbs.claims'), link: '/claims', active: true },
            { title: this.transloco.translate('layout.crumbs.claims-details'), link: '#', active: false }
        ]);
    }

    ngOnInit(): void {
        const claimId = this._route.snapshot.paramMap.get('id');
        if (claimId) {
            this.loadClaimDetails(claimId);
        }
    }

    loadClaimDetails(id: string): void {
        this._claimService.getByUuid(id).subscribe(data => {
            this.claim = data;
            this.loadDocuments(id);
            this.loadMessages(id);
        });
    }

    loadDocuments(claimId: string): void {
        this._attachmentService.getByClaimUuid(claimId).subscribe(docs => {
            this.attachments = docs;
        });
    }

    loadMessages(claimId: string): void {
        this._claimMessageService.getByClaimUuid(claimId).subscribe(msgs => {
            this.messages = msgs;
        });
    }


    sendMessage(): void {
        if (!this.newMessage.trim()) {
            return;
        }
        this._claimMessageService.create({}).subscribe(() => {
            this.loadMessages(this.claim.id);
            this.newMessage = '';
        });
    }

    statusClass(status: string): string {
        switch (status) {
            case 'ACCEPTED':
                return 'text-green-600 font-semibold';
            case 'REJECTED':
                return 'text-red-600 font-semibold';
            default:
                return 'text-gray-600 font-semibold';
        }
    }
}
