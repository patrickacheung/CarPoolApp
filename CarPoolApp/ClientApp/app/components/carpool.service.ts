import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { Carpool } from './carpool';
import { LoginService } from './login.service';
import 'rxjs/add/operator/map';

@Injectable()
export class CarpoolService {
    constructor(private http: Http, private loginService: LoginService) { }

    private carpools: Carpool[] = [];
    private testResponse = '';
	private getCarPoolsUrl = 'http://localhost:53381/api/CarPool/Get';
    private postCarPoolsUrl = 'http://localhost:53381/api/CarPool/Add';
    private searchCarPoolsUrl = 'http://localhost:53381/api/CarPool/Get?param={'
	private emailUrl = 'http://localhost:5000/api/CarPool/Email';
	private emailSentSubject = new BehaviorSubject<boolean>(false);
	private emailSuccessSubject = new BehaviorSubject<boolean>(false);

	getCarpools(): Observable<Carpool[]> {
		return this.http.get(this.getCarPoolsUrl)
			.map((res: Response) => {
				return res.json();
			});
    }

    searchCarpools(driver: string, day: string, time: string, location: string): Observable<Carpool[]> {
        var params = false;
        var driverAddition = '';
        var dayAddition = '';
        var timeAddition = '';
        var locationAddition = '';
        var ending = '';

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
        if (!(location === '')) {
            if (params) {
                locationAddition = ',\"EndLocation":\"' + location + '\"';
            } else {
                locationAddition = '\"EndLocation":\"' + location + '\"';
            }
            params = true;
            ending = '}';
        }
        if (!(day === '')) {
            if (params) {
                dayAddition = ',\"WeekDays":[\"' + day + '\"]';
            } else {
                dayAddition = '\"WeekDays":[\"' + day + '\"]';
            }
            params = true;
            ending = '}';
        }

        var callUrl = this.getCarPoolsUrl + driverAddition + locationAddition + timeAddition + dayAddition;

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
}
