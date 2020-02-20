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
	emailSent: boolean;
	emailSuccess: boolean;

	constructor(private carpoolService: CarpoolService, private loginService: LoginService) {
		this.carpools = [];
	}

	ngOnInit() {
		this.getCarpools();

		this.loginService.isLoggedIn().subscribe((isLoggedIn: boolean) => {
            this.isLoggedIn = isLoggedIn;
		});
		
		this.carpoolService.wasEmailSent().subscribe((emailSent: boolean) => {
			this.emailSent = emailSent;
		});

		this.carpoolService.wasEmailSuccess().subscribe((emailSuccess: boolean) => {
			this.emailSuccess = emailSuccess;
		});
	}

	getCarpools(): void {
		this.carpoolService.getCarpools()
			.subscribe(carpools => {
				this.carpoolsLoaded = Promise.resolve(true);
				this.carpools = carpools;
			});
	}

	sendEmail(carpool: Carpool): void {
		this.carpoolService.sendEmail(carpool);
	}
}
