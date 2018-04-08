import { Component, OnInit } from '@angular/core';

import { Carpool } from '../carpool';
import { CarpoolService } from '../carpool.service';

@Component({
	selector: 'carpools',
	templateUrl: './carpools.component.html',
	styleUrls: ['./carpools.component.css']
})
export class CarpoolsComponent implements OnInit {
	carpools: Carpool[];
	carpoolsLoaded: Promise<boolean>; // Adapted from: https://stackoverflow.com/a/44904470

	constructor(private carpoolService: CarpoolService) {
		this.carpools = [];
	}

	ngOnInit() {
		this.getCarpools();
	}

	getCarpools(): void {
		this.carpoolService.getCarpools()
			.subscribe(carpools => {
				this.carpoolsLoaded = Promise.resolve(true);
				this.carpools = carpools;
			});
	}
}
