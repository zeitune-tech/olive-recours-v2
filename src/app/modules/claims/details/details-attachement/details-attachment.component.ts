import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ClaimService } from "@core/services/claim/claim.service";
import { Subject, takeUntil } from "rxjs";
import { Claim } from "@core/services/claim/claim.interface";

@Component({
    selector: "app-claim-details-attachment",
    templateUrl: "./details-attachment.component.html",
})
export class DetailsAttachmentComponent implements OnInit {

    attachments: any[] = [];
    showUploadModal = false;
    uploadData: any = {
        name: '',
        description: ''
    };
    selectedFile: File | null = null;
    claimId: string | null = null; // You'll need to set this from the parent component
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private http: HttpClient,
        private fb: FormBuilder,
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

    downloadDocument(documentId: string): void {
        // Logic to handle document download
        console.log(`Downloading document with ID: ${documentId}`);
    }
}