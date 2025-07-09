import { ModuleWithProviders, NgModule } from '@angular/core';
import { AppConfigService } from './config.service';
import { APP_TEMPLATE_CONFIG } from './config.constants';

@NgModule()
export class TemplateConfigModule {

    constructor(private _appConfigService: AppConfigService) { }
    
    static forRoot(config: any): ModuleWithProviders<TemplateConfigModule> {
        return {
            ngModule : TemplateConfigModule,
            providers: [
                {
                    provide : APP_TEMPLATE_CONFIG,
                    useValue: config
                }
            ]
        };
    }
}
