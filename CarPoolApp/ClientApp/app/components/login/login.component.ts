import { Component, OnInit } from '@angular/core';

import { Login } from '../login';
import { LoginService } from '../login.service';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    loginModel: Login;
    isLoggedIn: boolean;
    isLoginCorrect: boolean;
    showLogin: boolean;
    loginSent: boolean;

    constructor(private loginService: LoginService) {
        this.loginModel = new Login();
        this.showLogin = false;
    }

    ngOnInit() {
        this.loginService.isLoggedIn().subscribe((isLoggedIn: boolean) => {
            this.isLoggedIn = isLoggedIn;
        });

        this.loginService.isLoginCorrect().subscribe((isLoginCorrect: boolean) => {
            this.isLoginCorrect = isLoginCorrect;
        });

        this.loginService.showLogin().subscribe((showLogin: boolean) => {
            this.showLogin = showLogin;
        });

        this.loginService.isLoginSent().subscribe((loginSent: boolean) => {
            this.loginSent = loginSent;
        });
    }

    onSubmit(): void {
        this.loginService.login(this.loginModel.username, this.loginModel.password);
    }
}
