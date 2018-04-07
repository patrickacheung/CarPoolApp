import { Component, OnInit } from '@angular/core';

import { Login } from '../login';
import { LoginService } from '../login.service';

@Component({
    selector: 'login',
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
    loginModel: Login;
    isLoggedIn: boolean;
    isLoginCorrect: boolean;

    constructor(private loginService: LoginService) {
        this.loginModel = new Login();
    }

    ngOnInit() {
        this.loginService.isLoggedIn().subscribe((isLoggedIn: boolean) => {
            this.isLoggedIn = isLoggedIn;
        });

        this.loginService.isLoginCorrect().subscribe((isLoginCorrect: boolean) => {
            this.isLoginCorrect = isLoginCorrect;
        });
    }

    onSubmit(): void {
        this.loginService.login(this.loginModel.username, this.loginModel.password);
    }
}
