import { Component, OnInit } from "@angular/core";

@Component({
    selector: "app-claim-details-attachment",
    templateUrl: "./details-attachment.component.html",
})
export class DetailsAttachmentComponent implements OnInit {

    attachments: any[] = []; // Replace 'any' with your attachment type
    constructor() { }

    ngOnInit(): void {
        // Initialization logic can go here if needed
    }

    
    uploadDocument(): void {
        // Logic to handle document upload
        console.log("Document upload initiated.");
    }

    downloadDocument(documentId: string): void {
        // Logic to handle document download
        console.log(`Downloading document with ID: ${documentId}`);
    }
}