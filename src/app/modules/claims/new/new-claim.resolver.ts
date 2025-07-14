import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '@core/services/user/user.service';
import { map } from 'rxjs';
import { ManagementEntity } from '@core/services/management-entity/management-entity.interface';

export const newClaimResolver: ResolveFn<boolean> = (route, state) => {
  const userService = inject(UserService);
  return userService.getManagementEntity().pipe(
    map((managementEntity: ManagementEntity) => {
      if (!managementEntity) {
        return false;
      }
      return true;
    })
  );
};
