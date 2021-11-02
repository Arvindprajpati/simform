import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';

const routes: Routes = [
  {
    path: 'sign-up',
    component: RegistrationComponent
  },
  {
    path: 'sign-in',
    component: LoginComponent
  },
  {
    path: 'edit-profile/:token',
    component: RegistrationComponent
  },
  {
    path: 'change-password/:token',
    component: ChangePasswordComponent
  },
  {
    path:'forget-password',
    component: ForgetPasswordComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
