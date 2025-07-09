import { NgModule, Optional, SkipSelf } from '@angular/core';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { ConfirmationModule } from './services/confirmation';
import { LoadingModule } from './services/loading';
import { MediaWatcherModule } from './services/media-watcher';
import { SplashScreenModule } from './services/splash-screen';
import { UtilsModule } from './services/utils';
import { ErroDialogModule } from './services/error/error-dialog.module';

@NgModule({
    imports  : [
        ConfirmationModule,
        LoadingModule,
        MediaWatcherModule,
        SplashScreenModule,
        UtilsModule,
        ErroDialogModule
    ],
    providers: [
        {
            // Disable 'theme' sanity check
            provide : MATERIAL_SANITY_CHECKS,
            useValue: {
                doctype: true,
                theme  : false,
                version: true
            }
        },
        {
            // Use the 'fill' appearance on Angular Material form fields by default
            provide : MAT_FORM_FIELD_DEFAULT_OPTIONS,
            useValue: {
                appearance: 'fill'
            }
        }
    ]
})
export class TemplateModule {
     
    constructor(@Optional() @SkipSelf() parentModule?: TemplateModule) {
        if ( parentModule ) {
            throw new Error('TemplateModule has already been loaded. Import this module in the AppModule only!');
        }
    }
}
