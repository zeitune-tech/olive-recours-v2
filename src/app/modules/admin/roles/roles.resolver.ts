import { ResolveFn } from '@angular/router';

export const rolesResolver: ResolveFn<boolean> = (route, state) => {
  return true;
};
