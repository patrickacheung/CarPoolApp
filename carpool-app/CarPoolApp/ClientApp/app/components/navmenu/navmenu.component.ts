import { Component, OnInit } from '@angular/core';

import { LoginService } from '../login.service';

@Component({
    selector: 'nav-menu',
    templateUrl: './navmenu.component.html',
    styleUrls: ['./navmenu.component.css']
})
export class NavMenuComponent implements OnInit {
    isLoggedIn: boolean;

    constructor(private loginService: LoginService) { }

    ngOnInit() { 
        this.loginService.isLoggedIn().subscribe((isLoggedIn: boolean) => {
            this.isLoggedIn = isLoggedIn;
        });
    }

}
