import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

import { Account } from './register/Account';
import { LoginService } from './login.service';

@Injectable()
export class RegisterService {
    constructor(private http: Http, private router: Router, private loginService: LoginService) { }

    private registerUrl = 'http://localhost:5000/api/Authentication/Register';
    private isRegisterSuccessSubject = new BehaviorSubject<boolean>(false);
    private isRegisterSentSubject = new BehaviorSubject<boolean>(false);

    register(model: Account): void {
        this.http.post(this.registerUrl, {Username: model.UserName, Password: model.Password, EmailAddress: model.EmailAddress,
            PhoneNumber: model.PhoneNumber}).subscribe((res: Response) => {
                this.isRegisterSentSubject.next(true);
                this.isRegisterSuccessSubject.next(true);

                setTimeout(() => {
                    this.reset();
                }, 2000);
                this.loginService.login(model.UserName, model.Password);
            }, () => {
                this.isRegisterSentSubject.next(true);
                this.isRegisterSuccessSubject.next(false);

                setTimeout(() => {
                    this.reset();
                }, 2000);
            });
    }

    isRegisterSuccess(): Observable<boolean> {
        return this.isRegisterSuccessSubject.asObservable();
    }

    isRegisterSent(): Observable<boolean> {
        return this.isRegisterSentSubject.asObservable();
    }

    private reset(): void {
        this.isRegisterSentSubject.next(false);
        this.isRegisterSuccessSubject.next(false);
    }
}
