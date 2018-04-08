import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, Http, Headers } from '@angular/http';

import { Carpool } from './carpool';
import { LoginService } from './login.service';
import 'rxjs/add/operator/map';

@Injectable()
export class CarpoolService {
	constructor(private http: Http, private loginService: LoginService) { }

    private getCarpoolUrl = 'http://localhost:53381/api/CarPool/Get';
    private carpools: Carpool[] = [];
    private testResponse = '';
	private getCarPoolsUrl = 'http://localhost:5000/api/CarPool/Get';
	private postCarPoolsUrl = 'http://localhost:5000/api/CarPool/Add';
	private emailUrl = 'http://localhost:5000/api/CarPool/Email';
	private emailSentSubject = new BehaviorSubject<boolean>(false);
	private emailSuccessSubject = new BehaviorSubject<boolean>(false);

	getCarpools(): Observable<Carpool[]> {
		return this.http.get(this.getCarPoolsUrl)
			.map((res: Response) => {
				return res.json();
			});
	}

	sendEmail(carpool: Carpool): void {
		const headers = new Headers();
		headers.append('Content-Type', 'application/json');
		headers.append('Authorization', 'Bearer ' + this.loginService.getToken());

		this.http.post(this.emailUrl, carpool, {headers: headers})
			.subscribe((res: Response) => {
				this.emailSentSubject.next(true);
				this.emailSuccessSubject.next(true);

				setTimeout(() => {
					this.reset();
				}, 2000);
			}, () => {
				this.emailSentSubject.next(true);
				this.emailSuccessSubject.next(false);

				setTimeout(() => {
					this.reset();
				}, 2000);
			});
	}

	wasEmailSent(): Observable<boolean> {
		return this.emailSentSubject.asObservable();
	}

	wasEmailSuccess(): Observable<boolean> {
		return this.emailSuccessSubject.asObservable();
	}

	private reset() {
		this.emailSentSubject.next(false);
		this.emailSuccessSubject.next(false);
	}
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
