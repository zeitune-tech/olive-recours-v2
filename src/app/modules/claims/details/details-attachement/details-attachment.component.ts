import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ClaimService } from "@core/services/claim/claim.service";
import { Subject, takeUntil } from "rxjs";
import { Claim } from "@core/services/claim/claim.interface";
import { Attachment } from "@core/services/attachement/attachment.interface";
import { environment } from "@env/environment";

@Component({
    selector: "app-claim-details-attachment",
    templateUrl: "./details-attachment.component.html",
})
export class DetailsAttachmentComponent implements OnInit {

    attachments: any[] = [];
    downloadPath: string = environment.request_url + '/attachments/download/';
    showUploadModal = false;
    uploadData: any = {
        name: '',
        description: ''
    };
    selectedFile: File | null = null;
    claimId: string | null = null; // You'll need to set this from the parent component
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _claimService: ClaimService,
        private _changeDetectorRef: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this._claimService.claim$.pipe(
            takeUntil(this._unsubscribeAll)
        ).subscribe((claim: Claim) => {
            this.claimId = claim.id;
            this.refreshAttachments();
            this._changeDetectorRef.markForCheck();
        });
    }

    openUploadModal(): void {
        this.uploadData = {
            name: '',
            description: ''
        };
        this.selectedFile = null;
        this.showUploadModal = true;
    }

    closeUploadModal(): void {
        this.showUploadModal = false;
    }

    onFileSelected(event: any): void {
        this.selectedFile = event.target.files[0];
    }

    submitDocument(): void {
        if (!this.selectedFile || !this.uploadData.name || !this.claimId) {
            console.log(this.selectedFile, this.uploadData.name, this.claimId);
            alert('Please fill all required fields');
            return;
        }

        const formData = new FormData();
        formData.append('file', this.selectedFile);
        formData.append('name', this.uploadData.name);
        formData.append('description', this.uploadData.description || '');
        formData.append('claimId', this.claimId!);

        this._claimService.uploadAttachment(formData).subscribe(
            (response) => {
                // Handle success
                this.closeUploadModal();
                this.refreshAttachments();
                },
            (error) => {
                // Handle error
                console.error('Error uploading document:', error);
                alert('Failed to upload document');
            }
        );
    }

    refreshAttachments(): void {
        this._claimService.getAttachmentsByClaimId(this.claimId!).subscribe((attachments: any[]) => {
            this.attachments = attachments;
        });
    }

    downloadDocument(document: Attachment): void {
        console.log(`Downloading document with ID: ${document.fileName}`);
        
        this._claimService.downloadAttachment(document.id, document.fileName).subscribe({
            error: (error) => {
                console.error('Error downloading document:', error);
                alert('Failed to download document. Please try again.');
            }
        });
    }
}