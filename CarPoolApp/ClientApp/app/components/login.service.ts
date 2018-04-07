import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

import { Login } from './login';

@Injectable()
export class LoginService {
    // Adapted from: https://netbasal.com/angular-2-persist-your-login-status-with-behaviorsubject-45da9ec43243

    constructor(private http: Http, private router: Router) { }

    private loginUrl = 'http://localhost:5000/api/Authentication/Authenticate';
    private isLoginSubject = new BehaviorSubject<boolean>(this.hasToken());

    isLoggedIn(): Observable<boolean> {
        return this.isLoginSubject.asObservable();
    }

    login(username: string, password: string): void {
        this.http.post(this.loginUrl, {Username: username, Password: password})
            .subscribe((res: Response) => {
                //console.log(res.json().token);
                localStorage.setItem('token', res.json().token);
                this.isLoginSubject.next(true);
                this.router.navigate(['home']);
            }, () => {
                this.isLoginSubject.next(false);
            });
    }

    logout(): void {
        localStorage.removeItem('token');
        this.isLoginSubject.next(false);
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    private hasToken(): boolean {
        // Adapted from: https://stackoverflow.com/a/39638260
        if (typeof window !== 'undefined') {
            return !!localStorage.getItem('token');
        } else {
            return false;
        }
    }
}
