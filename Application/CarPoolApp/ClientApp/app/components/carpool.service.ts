import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { Carpool } from './carpool';
import { LoginService } from './login.service';
import 'rxjs/add/operator/map';

@Injectable()
export class CarpoolService {
	constructor(private http: Http, private loginService: LoginService, private router: Router) { }

    private carpools: Carpool[] = [];
    private testResponse = '';
	private getCarPoolsUrl = 'http://localhost:5000/api/CarPool/Get';
    private postCarPoolsUrl = 'http://localhost:5000/api/CarPool/Add';
    private searchCarPoolsUrl = 'http://localhost:5000/api/CarPool/Get?param={'
	private emailUrl = 'http://localhost:5000/api/CarPool/Email';
	private emailSentSubject = new BehaviorSubject<boolean>(false);
	private emailSuccessSubject = new BehaviorSubject<boolean>(false);
	private createCarpoolSentSubject = new BehaviorSubject<boolean>(false);
	private createCarpoolSuccessSubject = new BehaviorSubject<boolean>(false);

	getCarpools(): Observable<Carpool[]> {
		return this.http.get(this.getCarPoolsUrl)
			.map((res: Response) => {
				return res.json();
			});
	}

    searchCarpools(driver: string, day: boolean[], time: string, location: string): Observable<Carpool[]> {
        var params = false;
        var driverAddition = '';
        var dayAddition = '';
        var timeAddition = '';
        var locationAddition = '';
        var ending = '}';

        if (!(driver === '' || driver == null)) {
            params = true;
            ending = '}';
            driverAddition = '\"Driver\":\"' + driver + "\"";
        }
        if (!(time === '' || time == null)) {
            if (params) {
                timeAddition = ',\"Time":\"' + time + '\"';
            } else {
                timeAddition = '\"Time":\"' + time + '\"';
            }
            params = true;
            ending = '}';
        }
        if (!(location === "" || location == null || location === "SFU")) {
            if (params) {
                locationAddition = ',\"EndLocation":\"' + location + '\"';
            } else {
                locationAddition = '\"EndLocation":\"' + location + '\"';
            }
            params = true;
            ending = '}';
        }
        if ((day[0] == true) || (day[1] == true) || (day[2] == true) || (day[3] == true) || (day[4] == true)) {
            var daysString = '';
            var firstDay = false;
            if (day[0]) {
                daysString = daysString + '"Monday"';
                firstDay = true;
            }

            if (day[1]) {
                if (firstDay) {
                    daysString = daysString + ',"Tuesday"';
                } else {
                    daysString = daysString + '"Tuesday"';
                }
                firstDay = true;
            }
            if (day[2]) {
                if (firstDay) {
                    daysString = daysString + ',"Wednesday"';
                } else {
                    daysString = daysString + '"Wednesday"';
                }
                firstDay = true;
            }
            if (day[3]) {
                if (firstDay) {
                    daysString = daysString + ',"Thursday"';
                } else {
                    daysString = daysString + '"Thursday"';
                }
                firstDay = true;
            }
            if (day[4]) {
                if (firstDay) {
                    daysString = daysString + ',"Friday"';
                } else {
                    daysString = daysString + '"Friday"';
                }
                firstDay = true;
            }
            

            if (params) {
                dayAddition = ',"WeekDays":[' + daysString + ']';
            } else {
                dayAddition = '"WeekDays":[' + daysString + ']';
            }
            params = true;
            ending = '}';
        }

        var callUrl = this.searchCarPoolsUrl + driverAddition + locationAddition + timeAddition + dayAddition + ending;

        return this.http.get(callUrl)
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
					this.resetEmail();
				}, 2000);
			}, () => {
				this.emailSentSubject.next(true);
				this.emailSuccessSubject.next(false);

				setTimeout(() => {
					this.resetEmail();
				}, 2000);
			});
	}

	createCarpool(carpool: Carpool): void {
		const headers = new Headers();
		headers.append('Content-Type', 'application/json');
		headers.append('Authorization', 'Bearer ' + this.loginService.getToken());

		this.http.post(this.postCarPoolsUrl, carpool, {headers: headers})
			.subscribe((res: Response) => {
				this.createCarpoolSentSubject.next(true);
				this.createCarpoolSuccessSubject.next(true);

				setTimeout(() => {
					this.resetCreateCarpool();
					this.router.navigate(['home']);
				}, 2000);
			}, () => {
				this.createCarpoolSentSubject.next(true);
				this.createCarpoolSuccessSubject.next(false);

				setTimeout(() => {
					this.resetEmail();
				}, 2000);
			});
	}

	wasEmailSent(): Observable<boolean> {
		return this.emailSentSubject.asObservable();
	}

	wasEmailSuccess(): Observable<boolean> {
		return this.emailSuccessSubject.asObservable();
	}

	wasCreateCarpoolSent(): Observable<boolean> {
		return this.createCarpoolSentSubject.asObservable();
	}

	wasCreateCarpoolSuccess(): Observable<boolean> {
		return this.createCarpoolSuccessSubject.asObservable();
	}

	private resetEmail() {
		this.emailSentSubject.next(false);
		this.emailSuccessSubject.next(false);
	}

	private resetCreateCarpool() {
		this.createCarpoolSentSubject.next(false);
		this.createCarpoolSuccessSubject.next(false);
	}
}
