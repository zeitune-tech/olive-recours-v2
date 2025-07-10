import { ResolveFn } from '@angular/router';
import { ClaimService } from '@core/services/claim/claim.service';
import { inject } from '@angular/core';

export const claimsResolver: ResolveFn<any[]> = (route, state) => {
  const claimService = inject(ClaimService);
  return claimService.getAll();
};
