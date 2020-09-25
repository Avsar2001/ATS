import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


import { LoginRoutingModule } from './login-routing.module';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { ForgotPassComponent } from './components/forgot-pass/forgot-pass.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ForgotPassComponent
  ],
  imports: [
    LoginRoutingModule,
    SharedModule
  ],
  entryComponents: [
    LoginComponent,
    RegisterComponent,
    ForgotPassComponent
  ]
})
export class LoginModule { }
