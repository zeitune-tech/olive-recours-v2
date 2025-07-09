export interface Attachment {
    id: string;
    claimUuid: string;
    fileName: string;
    filePath?: string;
    fileUrl?: string;
    name: string;
    description?: string;
    uploadedAt?: string;
}
