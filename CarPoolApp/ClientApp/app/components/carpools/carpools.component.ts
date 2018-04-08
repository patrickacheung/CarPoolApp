import { Component, OnInit } from '@angular/core';

import { Carpool } from '../carpool';
import { CarpoolService } from '../carpool.service';
import { LoginService } from '../login.service';

@Component({
	selector: 'carpools',
	templateUrl: './carpools.component.html',
	styleUrls: ['./carpools.component.css']
})
export class CarpoolsComponent implements OnInit {
	carpools: Carpool[];
	carpoolsLoaded: Promise<boolean>; // Adapted from: https://stackoverflow.com/a/44904470
	isLoggedIn: boolean;

	constructor(private carpoolService: CarpoolService, private loginService: LoginService) {
		this.carpools = [];
	}

	ngOnInit() {
		this.getCarpools();

		this.loginService.isLoggedIn().subscribe((isLoggedIn: boolean) => {
            this.isLoggedIn = isLoggedIn;
        });
	}

	getCarpools(): void {
		this.carpoolService.getCarpools()
			.subscribe(carpools => {
				this.carpoolsLoaded = Promise.resolve(true);
				this.carpools = carpools;
			});
	}

	sendEmail(): void {
		console.log('lol');
	}
}
