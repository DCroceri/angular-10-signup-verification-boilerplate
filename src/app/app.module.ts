import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { JwtInterceptor, ErrorInterceptor, appAuthInitializer, appUserInitializer } from './_helpers';
import { AccountService, UserService } from './_services';
import { AppComponent } from './app.component';
import { AlertComponent } from './_components';

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent,
        AlertComponent
    ],
    providers: [
        { provide: APP_INITIALIZER, useFactory: appAuthInitializer, multi: true, deps: [AccountService] },
        { provide: APP_INITIALIZER, useFactory: appUserInitializer, multi: true, deps: [UserService] },
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }

    ],
    bootstrap: [AppComponent]
})
export class AppModule { }