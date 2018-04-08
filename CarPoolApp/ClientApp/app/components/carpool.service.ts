import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, Http, Headers } from '@angular/http';

import { Carpool } from './carpool';
import { CARPOOLS } from './mock-carpools';

@Injectable()
export class CarpoolService {

    private getCarpoolUrl = 'http://localhost:53381/api/CarPool/Get';
    private carpools: Carpool[] = [];
    private testResponse = '';

    constructor(public http: Http) { }

    getCarpools(): Observable<Carpool[]> {
        var results = '';
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        this.http.get(this.getCarpoolUrl, {
            headers: headers
        }).subscribe(
            data => {
                console.log(data);
                var carpoolArray = data.json();
                for (var i = 0; i < carpoolArray.length; i++) {
                    var currentCarpool = carpoolArray[i];
                    this.carpools.push(new Carpool(carpoolArray[i].driver, carpoolArray[i].carDescription, carpoolArray[i].seats, carpoolArray[i].endLocation, carpoolArray[i].time));
                }
                
            });

        console.log("************");
        console.log(results);
        console.log("************");

        return of(this.carpools);
    }

    getCarpoolsCall(): Observable<Carpool[]> {
        return of(CARPOOLS);
  }
}
