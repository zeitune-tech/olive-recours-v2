import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ParamsService } from './params.service';
import { firstValueFrom } from 'rxjs';

export const ParamsResolver: ResolveFn<Promise<boolean>> = async (route, state) => {
  const paramsService = inject(ParamsService);
  try {
    await firstValueFrom(paramsService.getClosure());
    await firstValueFrom(paramsService.getCurrentFee());
    return true;
  } catch {
    return false;
  }
};
