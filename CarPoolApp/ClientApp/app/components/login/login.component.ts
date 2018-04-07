import { Component, OnInit } from '@angular/core';

import { Login } from '../login';
import { LoginService } from '../login.service';

@Component({
    selector: 'login',
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
    loginModel: Login;
    showErrorMsg: boolean;
    isLoggedIn: boolean;

    constructor(private loginService: LoginService) {
        this.loginModel = new Login();
    }

    ngOnInit() {
        this.loginService.isLoggedIn().subscribe((isLoggedIn: boolean) => {
            this.showErrorMsg = !isLoggedIn;
            this.isLoggedIn = isLoggedIn;
        });
    }

    onSubmit(): void {
        this.loginService.login(this.loginModel.username, this.loginModel.password);
    }
}
