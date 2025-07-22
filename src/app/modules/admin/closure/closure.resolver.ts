import { ResolveFn } from '@angular/router';

export const closureResolver: ResolveFn<boolean> = (route, state) => {
  return true;
};
