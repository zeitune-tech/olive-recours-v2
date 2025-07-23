import { ClaimStatus } from "./claim-status.enum";

export interface Claim {
    id: string;

    dateOfSinister?: string;
    claimNumber: string;
    insuredName: string;


    opponentCompanyName?: string;
    opponentClaimNumber?: string;
    opponentInsuredName?: string;

    amount: number;
    insuredAmount: number;
    comment?: string;

    declaringCompanyUuid: string;
    declaringCompanyLogo?: string;
    declaringCompanyName?: string;
    opponentCompanyUuid: string;
    opponentCompanyLogo?: string;

    // Champs ajoutés pour cohérence avec le backend
    immatriculationDeclarant?: string;
    immatriculationSubissant?: string;
    natureOfSinister?: string; // Utilise l'enum NatureSinistre côté front
    garantiMiseEnOeuvre?: string[]; // Utilise l'enum GarantiMiseEnOeuvre côté front

    status: ClaimStatus;
    submissionDate?: string;
    acceptanceDate?: string;
}
