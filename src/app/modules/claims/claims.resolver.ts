import { ResolveFn } from '@angular/router';
import { ClaimService } from '@core/services/claim/claim.service';
import { inject } from '@angular/core';
import { UserService } from '@core/services/user/user.service';
import { forkJoin } from 'rxjs';
import { Claim } from '@core/services/claim/claim.interface';
import { ManagementEntity } from '@core/services/management-entity/management-entity.interface';

export const claimsResolver: ResolveFn<{ claims: Claim[]; company: ManagementEntity }> = (route, state) => {
  const claimService = inject(ClaimService);
  const userService = inject(UserService);
  return forkJoin({
    claims: claimService.getAll(),
    company: userService.getManagementEntity()
  });
};
