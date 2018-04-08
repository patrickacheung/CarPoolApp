import { Component, OnInit } from '@angular/core';
import { Carpool } from '../carpool';
import { CarpoolService } from '../carpool.service';
import { Search } from '../Search';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
    selector: 'viewallcarpools',
    templateUrl: './viewallcarpools.component.html',
    styleUrls: ['../carpools/carpools.component.css']
})


export class ViewAllCarpoolsComponent implements OnInit {
    originalCarpools: Carpool[];
    carpools: Carpool[];
    location: string;
    searchModel: Search;
    day: boolean[] = [];

    constructor(private carpoolService: CarpoolService) {
        this.searchModel = new Search();
    }

    ngOnInit() {
        this.getCarpools();
    }
    
    getCarpools(): void {
        this.carpoolService.getCarpools()
            .subscribe(carpools => this.carpools = carpools);
        this.originalCarpools = this.carpools;
    }

    filter(model: Search): void {
        this.carpoolService.searchCarpools(model.driver, this.day, model.arrivalTime, model.location)
            .subscribe(carpools => this.carpools = carpools);

        //this.carpools = this.carpools.filter(
        //    carpool => ((model.driver == null || (model.driver === "")) || carpool.driver.indexOf(model.driver) >= 0)
        //        && ((model.location == null || (model.location === "")) || carpool.campus.indexOf(model.location) >= 0)
        //        && ((model.arrivalTime == null || (model.arrivalTime === "")) || carpool.datetime.toString().indexOf(model.arrivalTime) >= 0)
        //        && ((model.day == null || (model.day === "")) || carpool.datetime.toString().indexOf(model.day) >= 0));
    }

    onSubmit(): void {

        this.searchModel.location = this.location;

        this.day = [];

        this.day.push(this.searchModel.monday);
        this.day.push(this.searchModel.tuesday);
        this.day.push(this.searchModel.wednesday);
        this.day.push(this.searchModel.thursday);
        this.day.push(this.searchModel.friday);

        this.carpools = this.originalCarpools;
        this.filter(this.searchModel);


    }

    onChange(deviceValue: string) {
        this.location = deviceValue;
    }
}
