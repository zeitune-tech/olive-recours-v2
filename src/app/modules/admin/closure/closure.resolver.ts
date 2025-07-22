import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ClosureService } from './closure.service';
import { firstValueFrom } from 'rxjs';

export const closureResolver: ResolveFn<Promise<boolean>> = async (route, state) => {
  const closureService = inject(ClosureService);
  try {
    await firstValueFrom(closureService.getClosure());
    return true;
  } catch {
    return false;
  }
};
