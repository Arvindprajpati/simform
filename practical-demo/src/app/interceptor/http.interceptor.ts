import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthenticationService,
    private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): any {
    if (localStorage.getItem('AUTH_TOKEN')) {
      request = this.addToken(request, localStorage.getItem('AUTH_TOKEN'));
    }
    return next.handle(request).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        localStorage.clear();
        this.router.navigate(['']);
      }
      return throwError(error);
    }));
  }

  private addToken(request: HttpRequest<any>, token: string | null) {
    return request.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

}
