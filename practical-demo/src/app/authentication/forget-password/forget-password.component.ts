import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {

  forgetPassForm: FormGroup;
  isSubmitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private location: Location,
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  get f(): any {
    return this.forgetPassForm.controls;
  }
  formInitialize(): void {
    this.forgetPassForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email,
      Validators.pattern(/^[a-zA-Z0-9][-a-zA-Z0-9.!#$%&'*+-=?^_`{|}~\/]+@([-a-zA-Z0-9]+\.)+[a-zA-Z]{2,5}$/)]]
    })
  }

  async formSubmit() {
    try {
      this.isSubmitted = true;
      this.forgetPassForm.markAllAsTouched();
      if (this.forgetPassForm.valid) {
        let body = {
          email: this.forgetPassForm.value.email
        }
        console.log(body);
        const data = await this.authenticationService.forgetPass(body);
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
