import { Component, OnInit } from '@angular/core';
import { Carpool } from '../carpool';
import { CarpoolService } from '../carpool.service';
import { Search } from '../Search';

@Component({
    selector: 'viewallcarpools',
    templateUrl: './viewallcarpools.component.html',
    styleUrls: ['../carpools/carpools.component.css']
})


export class ViewAllCarpoolsComponent implements OnInit {

    carpools: Carpool[];
    location: string;
    search: Search;
    day: string;

    constructor(private carpoolService: CarpoolService) {
        this.search = new Search();
    }

    ngOnInit() {
        this.getCarpools();
    }

    getCarpools(): void {
        this.carpoolService.getCarpools()
            .subscribe(carpools => this.carpools = carpools);
    }

    onSubmit(): void {
        
        console.log(this.day);
        console.log(this.location);
    }

    setLocation(locationInput: string): void{
        this.location = locationInput;
    }

    setDay(dayInput: string): void {
        this.day = dayInput;
    }


    //search(): void {
     //   let term = this.searchTerm;
     //   this.items = this.itemsCopy.filter(function (tag) {
     //       return tag.name.indexOf(term) >= 0;
     //   });
    //}

}
