import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // for NgModel

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';


import { ButtonModule, ToggleButtonModule, SpinnerModule, SliderModule } from 'primeng/primeng';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ButtonModule,
        ToggleButtonModule,
        SpinnerModule,
        SliderModule,
        AppRoutingModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
