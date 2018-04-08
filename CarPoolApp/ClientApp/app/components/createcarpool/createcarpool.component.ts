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

    constructor(private carpoolService: CarpoolService, private fb: FormBuilder) { }

    ngOnInit() {
        this.form = this.fb.group({
            startLocation: ['', Validators.compose([Validators.required])],
            endLocation: ['', Validators.required],
            seats: ['', [Validators.required, Validators.min(1)]],
            carDescription: ['', [Validators.required, Validators.minLength(5)]],
            time:  ['', [Validators.required, isTime]]
        });
    }

    createCarpool(): void {
        
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
