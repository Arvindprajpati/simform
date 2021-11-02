import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

// Internal Imports
import { environment } from '../../environments/environment';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommonApiService {

  // Default Parameters
  httpDefaults: HTTPParam = {
    apiName: '',
    parameterObject: {},
    methodType: 'post',
    showLoading: true,
    isCachable: false,
    originKey: 'base_url',
    isOffline: true
  }

  // Tracking API Calls
  apiInProcess: any = []

  // Constructor
  constructor(private http: HttpClient) { }

  /**
   * POST REQUEST TO THE HTTP USING Observable
   * @param {string} apiName - API Name 
   * @param {*} [parameterObject] - Parameter to pass in request (By Default = {})
   * @returns {Observable<any>} 
   * @memberof CommonAPIService
   */
  private post(apiName: string, parameterObject?: any, showLoading?: boolean, isCachable?: boolean, originKey?: string, isOffline?: boolean): Observable<any> {
    return this.http.post(`${environment['API_BASE_URL'] + apiName}`, parameterObject).pipe(
      map((res: any) => {
        this.hideLoader(apiName);
        if (res) {
          return res;
        } else {
          return {};
        }
      }),
      catchError((error) => {
        this.hideLoader(apiName);
        // return error;
        return throwError(error?.error);
      })
    )
  }
  /**
 * POST REQUEST TO THE HTTP USING Observable
 * @param {string} apiName - API Name 
 * @param {*} [parameterObject] - Parameter to pass in request (By Default = {})
 * @returns {Observable<any>} 
 * @memberof CommonAPIService
 */
  private put(apiName: string, parameterObject?: any, showLoading?: boolean, isCachable?: boolean, originKey?: string, isOffline?: boolean): Observable<any> {
    return this.http.put(`${environment['API_BASE_URL'] + apiName}`, parameterObject).pipe(
      map((res: any) => {
        this.hideLoader(apiName);
        if (res) {
          return res;
        } else {
          return {};
        }
      }),
      catchError((error) => {
        this.hideLoader(apiName);
        // return error;
        return throwError(error?.error);
      })
    )
  }

  private hideLoader(apiName: string): void {
    if (this.apiInProcess.includes(apiName)) {
      const index = this.apiInProcess.findIndex((x: any) => x === apiName);
      this.apiInProcess.splice(index, 1);
    }
    if (this.apiInProcess.length === 0) {
      // this.spinner.hide();
    }
  }
  private patch(apiName: string, parameterObject?: any, showLoading?: boolean, isCachable?: boolean, originKey?: string, isOffline?: boolean): Observable<any> {
    return this.http.patch(`${environment['API_BASE_URL'] + apiName}`, parameterObject).pipe(
      map((res: any) => {
        this.hideLoader(apiName);
        if (res) {
          return res;
        } else {
          return {};
        }
      }),
      catchError((error) => {
        this.hideLoader(apiName);
        // return error;
        return throwError(error?.error);
      })
    )
  }
  /**
* POST REQUEST TO THE HTTP USING Observable
* @param {string} apiName - API Name 
* @param {*} [parameterObject] - Parameter to pass in request (By Default = {})
* @returns {Observable<any>} 
* @memberof CommonAPIService
*/
  private delete(apiName: string, parameterObject?: any, showLoading?: boolean, isCachable?: boolean, originKey?: string, isOffline?: boolean, data?: any): Observable<any> {
    let queryParams = this.getQueryParams(data);
    return this.http.delete(`${environment['API_BASE_URL'] + apiName}` + `${queryParams}`, parameterObject).pipe(
      map((res: any) => {
        this.hideLoader(apiName);
        if (res) {
          return res;
        } else {
          return {};
        }
      }),
      catchError((error) => {
        this.hideLoader(apiName);
        // return error;
        return throwError(error?.error);
      })
    )
  }
  private getQueryParams(data: any) {
    let params = '';
    if (Object.keys(data).length > 0) {
      for (const key in data) {
        params = '/';
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          params += `${data[key]}`;
        }
      }
    }
    return params;
  }
  /**
   * GET REQUEST TO THE HTTP USING Observable
   * @param {string} apiName - API Name 
   * @param {*} [parameterObject] - Parameter to pass in request (By Default = {})
   * @returns {Observable<any>} 
   * @memberof CommonAPIService
   */
  private get(url: string, showLoading?: boolean, isCachable?: boolean, originKey?: string, responseType?: string, isOffline?: boolean, data?: any): Observable<any> {
    let queryParams = this.getQueryParams(data);
    return this.http.get(`${environment['API_BASE_URL'] + url}` + `${queryParams}`).pipe(
      map((res: any) => {
        this.hideLoader(url);
        if (responseType === 'blob') {
          return res;
        } else if (res) {
          return res;
        } else {
          return {};
        }
      }),
      catchError((error) => {
        this.hideLoader(url);
        // return error;
        return throwError(error?.error);
      })
    );
  }

  /**
  * 
  * GET HTTP RESPONSE USING PROMISE
  * @param {string} apiName API NAME
  * @param {any} [parameterObject={}] 
  * @param {string} [methodType="post"] 
  * @param {boolean} [showLoading=true] 
  * @returns {*} 
  * @memberof CommonAPIService
  */
  public getPromiseResponse(httpParam: HTTPParam): Promise<any> {
    const parameters = Object.assign({}, this.httpDefaults, httpParam);
    // if (parameters.showLoading) {
    //   this.apiInProcess.push(parameters.apiName);
    //   //   this.loaderService.show();
    // }
    if (parameters.showLoading) {
      this.apiInProcess.push(parameters.apiName);
      // this.spinner.show();
    }

    switch (parameters.methodType) {
      case 'post':
        return this.post(parameters.apiName, parameters.parameterObject, parameters.showLoading, parameters.isCachable, parameters.originKey, parameters.isOffline).toPromise();
      case 'put':
        return this.put(parameters.apiName, parameters.parameterObject, parameters.showLoading, parameters.isCachable, parameters.originKey, parameters.isOffline).toPromise();
      case 'patch':
        return this.patch(parameters.apiName, parameters.parameterObject, parameters.showLoading, parameters.isCachable, parameters.originKey, parameters.isOffline).toPromise();
      case 'delete':
        return this.delete(parameters.apiName, parameters.parameterObject, parameters.showLoading, parameters.isCachable, parameters.originKey, parameters.isOffline, parameters.parameterObject).toPromise();
      case 'get':
        return this.get(parameters.apiName, parameters.showLoading, parameters.isCachable, parameters.originKey, parameters.responseType, parameters.isOffline, parameters.parameterObject).toPromise();
      default:
        return this.get(parameters.apiName, parameters.showLoading, parameters.isCachable, parameters.originKey, parameters.responseType, parameters.isOffline).toPromise();
    }
  }
}


export interface HTTPParam {
  apiName: string,
  parameterObject?: any;
  methodType?: any;
  showLoading?: boolean;
  isCachable?: boolean;
  originKey?: string;
  responseType?: string;
  isOffline?: boolean
};
