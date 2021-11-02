import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MustMatch } from 'src/app/validators/must-match.validator';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  @ViewChild('fileUpload') fileUpload: ElementRef;
  signUpForm: FormGroup;
  isSubmitted = false;
  token: any = '';
  isEdit = false;

  constructor(
    private formBuilder: FormBuilder,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }


  formInitialize(): void {
    this.signUpForm = this.formBuilder.group({
      profileImage: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email,
      Validators.pattern(/^[a-zA-Z0-9][-a-zA-Z0-9.!#$%&'*+-=?^_`{|}~\/]+@([-a-zA-Z0-9]+\.)+[a-zA-Z]{2,5}$/)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(18)]],
      cPassword: ['', Validators.required]
    }, {
      validators: [
        MustMatch('password', 'cPassword')
      ],
    });
    if (this.isEdit) {
      this.patchFormValue()
    }
  }

  get f(): any {
    return this.signUpForm.controls;
  }

  async patchFormValue() {
    try {
      const data = await this.authenticationService.getUserByToken(this.token);
      this.signUpForm.patchValue({
        profileImage: this.signUpForm.value.profileImage,
        fName: this.signUpForm.value.fName,
        lName: this.signUpForm.value.lName,
        email: this.signUpForm.value.email,
        password: this.signUpForm.value.password
      });
    } catch (error) {
      console.log(error);
    }
  }

  async formSubmit() {
    try {
      this.isSubmitted = true;
      this.signUpForm.markAllAsTouched();
      if (this.signUpForm.valid) {
        if (this.isEdit) {
          const body = new FormData();
          body.append('profile', this.fileUpload.nativeElement.files[0]);
          body.append('firstName', this.signUpForm.value.firstName);
          body.append('lastName', this.signUpForm.value.lastName);
          body.append('email', this.signUpForm.value.email);
          body.append('password', this.signUpForm.value.password);
          const data = await this.authenticationService.editUser(body);
        } else {
          const body = new FormData();
          body.append('profile', this.fileUpload.nativeElement.files[0]);
          body.append('firstName', this.signUpForm.value.firstName);
          body.append('lastName', this.signUpForm.value.lastName);
          body.append('email', this.signUpForm.value.email);
          body.append('password', this.signUpForm.value.password);
          const data = await this.authenticationService.signUp(body,);
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
    this.activatedRoute.paramMap.subscribe(params => {
      this.token = params.get('token');
    });
    this.isEdit = this.router.url == '/sign-up' ? false : true;
    this.formInitialize();
  }


}
