import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MustMatch } from 'src/app/validators/must-match.validator';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  changePassForm: FormGroup;
  isSubmitted = false;
  token: any = '';

  constructor(
    private formBuilder: FormBuilder,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService
  ) { }

  get f(): any {
    return this.changePassForm.controls;
  }
  formInitialize(): void {
    this.changePassForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(18)]],
      cPassword: ['', Validators.required]
    }, {
      validators: [
        MustMatch('password', 'cPassword')
      ],
    })
  }

  async formSubmit() {
    try {
      this.isSubmitted = true;
      this.changePassForm.markAllAsTouched();
      if (this.changePassForm.valid) {
        let body = {
          id: this.token,
          password: this.changePassForm.value.password
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
    this.activatedRoute.paramMap.subscribe(params => {
      this.token = params.get('token');
    });
    this.formInitialize();
  }

}
