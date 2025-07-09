import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { MarkdownModule } from 'ngx-markdown';
import { CoreModule } from './core/core.module';
import { TemplateModule } from '../@lhacksrt/template.module';
import { TemplateConfigModule } from '../@lhacksrt/services/config';
import { appConfig } from './core/config/app.config';
import { LayoutModule } from './layout/layout.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServicesModule } from './core/services/services.module';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		AppRoutingModule,

		TemplateModule,
        TemplateConfigModule.forRoot(appConfig),

        // Core module of your application
        CoreModule,

        // Layout module of your application
        LayoutModule,
        // 3rd party modules that require global configuration via forRoot
        MarkdownModule.forRoot({}),
		
		ServicesModule
	],
	providers: [
        provideHttpClient(withInterceptorsFromDi()),
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
