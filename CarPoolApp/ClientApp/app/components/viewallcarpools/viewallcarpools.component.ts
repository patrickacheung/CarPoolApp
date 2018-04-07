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
    searchModel: Search;
    day: string;

    constructor(private carpoolService: CarpoolService) {
        this.searchModel = new Search();
    }

    ngOnInit() {
        this.getCarpools();
    }

    getCarpools(): void {
        this.carpoolService.getCarpools()
            .subscribe(carpools => this.carpools = carpools);
    }

    onSubmit(): void {

        this.searchModel.day = this.day;
        this.searchModel.location = this.location;
        
        console.log(this.searchModel.driver);
        console.log(this.searchModel.arrivalTime);
    }

    public setLocation(locationInput: string): void{
        this.location = locationInput;
    }

    public setDay(dayInput: string): void {
        this.day = dayInput;
    }
}
