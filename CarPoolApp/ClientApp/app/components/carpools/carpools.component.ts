import { Component, OnInit } from '@angular/core';

import { Carpool } from '../carpool';
import { CarpoolService } from '../carpool.service';

@Component({
  selector: 'carpools',
  templateUrl: './carpools.component.html'
})
export class CarpoolsComponent implements OnInit {
  carpools: Carpool[];

  constructor(private carpoolService: CarpoolService) { }

  ngOnInit() {
    this.getCarpools();
  }

  getCarpools(): void {
    this.carpoolService.getCarpools()
        .subscribe(carpools => this.carpools = carpools);
  }
}
