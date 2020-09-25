import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HeaderComponent } from './home-layout/header/header.component';
import { FooterComponent } from './home-layout/footer/footer.component';
import { DefaultLayoutComponent } from './home-layout/default-layout/default-layout.component';
import { SharedModule } from './shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';

import { AngularFireModule } from "@angular/fire";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { environment } from "../environments/environment";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { NgwWowModule } from 'ngx-wow';
import { NgxSpinnerModule } from "ngx-spinner";



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DefaultLayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule,
    MatDialogModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    NgwWowModule,
    NgxSpinnerModule

  ],
  bootstrap: [
    AppComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
