// error-dialog-queue.service.ts
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from './error-dialog.component';

@Injectable({
    providedIn: 'root'
})
export class ErrorDialogQueueService {

    private queue: string[] = [];       // Queue to hold error messages
    private isDialogOpen = false;       // Flag to track if a dialog is open

    constructor(private dialog: MatDialog) {}

    /**
     * Add an error message to the queue and process the queue
     * @param message The error message to display
     */
    public addErrorToQueue(message: string): void {
        this.queue.push(message);       // Add message to the queue
        this.processQueue();            // Start processing the queue
    }

    /**
     * Process the queue by showing the next error dialog if none is open
     */
    private processQueue(): void {
        if (!this.isDialogOpen && this.queue.length > 0) {
            const message = this.queue.shift();   // Get the next message
            this.isDialogOpen = true;             // Set dialog flag

            // Open the dialog with the message
            const dialogRef = this.dialog.open(ErrorDialogComponent, {
                data: { message: message }
            });

            // When dialog closes, reset flag and process the queue
            dialogRef.afterClosed().subscribe(() => {
                this.isDialogOpen = false;
                this.processQueue();
            });
        }
    }
}
