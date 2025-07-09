export interface ClaimMessage {
    uuid?: string;
    claimId: string;
    userId: string;
    userName?: string;
    companyName?: string;
    content: string;
    messageDate: string;
}
