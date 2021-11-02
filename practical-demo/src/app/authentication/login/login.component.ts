import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  isSubmitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private location: Location,
    private authenticationService: AuthenticationService
  ) { }

  formInitialize(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email,
      Validators.pattern(/^[a-zA-Z0-9][-a-zA-Z0-9.!#$%&'*+-=?^_`{|}~\/]+@([-a-zA-Z0-9]+\.)+[a-zA-Z]{2,5}$/)]],
      password: ['', [Validators.required]],
    })
  }

  get f(): any {
    return this.loginForm.controls;
  }

  async formSubmit() {
    try {
      this.isSubmitted = true;
      this.loginForm.markAllAsTouched();
      if (this.loginForm.valid) {
        let body = {
          email: this.loginForm.value.email,
          password: this.loginForm.value.password
        }
        console.log(body);
        const data = await this.authenticationService.login(body);
        if(data){
          localStorage.setItem('AUTH_TOKEN', data.token);
          localStorage.setItem('U_ID', data.uid);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  back(): void {
    this.location.back();
  }

  ngOnInit(): void {
    this.formInitialize();
  }
}
