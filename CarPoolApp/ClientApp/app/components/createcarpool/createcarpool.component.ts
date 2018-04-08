import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { CarpoolService } from '../carpool.service';
import { Carpool } from '../carpool';
import { isNumeric } from 'rxjs/util/isNumeric';

@Component({
    selector: 'createcarpool',
    templateUrl: './createcarpool.component.html',
    styleUrls: ['./createcarpool.component.css']
})
export class CreateCarpoolComponent implements OnInit {
    form: FormGroup;
    mon: boolean = true;
    tues: boolean = true;
    wed: boolean = true;
    thurs: boolean = true;
    fri: boolean = true;
    additionalDetails: string = "";
    createCarpoolSent: boolean;
	createCarpoolSuccess: boolean;

    constructor(private carpoolService: CarpoolService, private fb: FormBuilder) { }

    ngOnInit() {
        this.carpoolService.wasCreateCarpoolSent().subscribe((carpoolSent: boolean) => {
			this.createCarpoolSent = carpoolSent;
		});

		this.carpoolService.wasCreateCarpoolSuccess().subscribe((carpoolSuccess: boolean) => {
			this.createCarpoolSuccess = carpoolSuccess;
		});

        this.form = this.fb.group({
            startLocation: ['', Validators.compose([Validators.required])],
            endLocation: ['', Validators.required],
            seats: ['', [Validators.required, Validators.min(1)]],
            carDescription: ['', [Validators.required, Validators.minLength(5)]],
            time:  ['', [Validators.required, isTime]]
        });
    }

    createCarpool(): void {
        const weekDays: string[] = getWeekDays(this.mon, this.tues, this.wed, this.thurs, this.fri);
        const carpool = <Carpool>({
            driver: "",
            seats: this.form.value.seats,
            carDescription: this.form.value.carDescription,
            startLocation: this.form.value.startLocation,
            endLocation: this.form.value.endLocation,
            weekDays: weekDays,
            time: this.form.value.time,
            additionalDetails: this.additionalDetails ? this.additionalDetails : ""
        });
        this.carpoolService.createCarpool(carpool);
    }
}

function isTime(c: FormControl) {
    const timeComp: string[] = c.value.split(":");
    if (timeComp.length !== 2) {
        return {
            isTime: {
                valid: false
            }
        }
    }

    if (timeComp[0].length === 2 && timeComp[1].length === 2) {
        if (!isNumeric(timeComp[0]) || !isNumeric(timeComp[1])) {
            return {
                isTime: {
                    valid: false
                }
            }
        }

        return null;
    }

    return {
        isTime: {
            valid: false
        }
    }
}

function getWeekDays(mon: boolean, tues: boolean, wed: boolean, thurs: boolean, fri: boolean): string[] {
    let weekdays: string[] = [];
    if (mon) { weekdays.push("Monday") };
    if (tues) { weekdays.push("Tuesday") };
    if (wed) { weekdays.push("Wednesday") };
    if (thurs) { weekdays.push("Thursday") };
    if (fri) { weekdays.push("Friday") };

    return weekdays;
}