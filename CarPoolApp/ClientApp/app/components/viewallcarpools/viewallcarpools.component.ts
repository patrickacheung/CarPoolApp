import { Component, OnInit } from '@angular/core';
import { Carpool } from '../carpool';
import { CarpoolService } from '../carpool.service';


@Component({
  selector: 'viewallcarpools',
    templateUrl: './viewallcarpools.component.html',
    styleUrls: ['../carpools/carpools.component.css']
})





export class ViewAllCarpoolsComponent implements OnInit {

    carpools: Carpool[];

    constructor(private carpoolService: CarpoolService) { }

    ngOnInit() {
        this.getCarpools();
    }

    getCarpools(): void {
        this.carpoolService.getCarpools()
            .subscribe(carpools => this.carpools = carpools);
    }

    //search(): void {
     //   let term = this.searchTerm;
     //   this.items = this.itemsCopy.filter(function (tag) {
     //       return tag.name.indexOf(term) >= 0;
     //   });
    //}

}
