import { Injectable } from '@angular/core';
import { APINAME } from '../constants/api-name.constants';
import { CommonApiService } from './common-api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private commonApiService: CommonApiService) { }


  login(data: any): Promise<any> {
    return this.commonApiService.getPromiseResponse({ apiName: APINAME.LOGIN, methodType: 'post', parameterObject: data });
  }

  signUp(data: any): Promise<any> {
    return this.commonApiService.getPromiseResponse({ apiName: APINAME.SIGN_UP, methodType: 'post', parameterObject: data });
  }

  editUser(data: any): Promise<any> {
    return this.commonApiService.getPromiseResponse({ apiName: APINAME.SIGN_UP, methodType: 'post', parameterObject: data });
  }

  getUserByToken(token: any): Promise<any> {
    return this.commonApiService.getPromiseResponse({ apiName: APINAME.GET_USER+ '?token=' + token, methodType: 'get' });
  }

  changePass(data: any): Promise<any> {
    return this.commonApiService.getPromiseResponse({ apiName: APINAME.CHANGE_PASSWORD, methodType: 'post', parameterObject: data });
  }

  forgetPass(data: any): Promise<any> {
    return this.commonApiService.getPromiseResponse({ apiName: APINAME.FORGOT_PASSWORD, methodType: 'post', parameterObject: data });
  }

  logout(): Promise<any> {
    return this.commonApiService.getPromiseResponse({ apiName: APINAME.LOG_OUT, methodType: 'post' });
  }
}
