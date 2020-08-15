import { Injectable } from '@angular/core';
import { take, exhaustMap } from 'rxjs/operators';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams } from '@angular/common/http';

import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    constructor(
        private authservice: AuthService
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return this.authservice.user.pipe(
            take(1),
            exhaustMap(
                user => {
                    console.log("in interceptor");
                    if(!user) {
                        return next.handle(req);
                    }
                    const modifiedReq = req.clone(
                        {
                        params : new HttpParams().set('auth', user.token)
                        }
                    );
                    return next.handle(modifiedReq);
                }
            )
        );  
    }
}