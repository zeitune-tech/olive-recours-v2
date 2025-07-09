import { provideTransloco, TranslocoModule } from '@jsverse/transloco';
import { isDevMode, NgModule } from '@angular/core';
import { TranslocoHttpLoader } from './transloco.http-loader';
import { provideHttpClient } from '@angular/common/http';

@NgModule({
    exports  : [ TranslocoModule ],
    providers: [
        provideHttpClient(),
        provideTransloco({
          config: {
            availableLangs: ['en', 'fr', 'sn', 'ar'],
            defaultLang: 'fr',
            reRenderOnLangChange: true,
            prodMode: !isDevMode(),
            missingHandler: {
              useFallbackTranslation: true, // Falls back to default if key is missing
              logMissingKey: true // Logs missing translation keys
            }
          },
          loader: TranslocoHttpLoader,
        }),
    ],
})
export class TranslocoCoreModule { }
