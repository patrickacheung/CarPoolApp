import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Account } from './Account'
import { RegisterService } from '../register.service';

@Component({
    selector: 'register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    model: Account;
    form: FormGroup;
    isRegisterSuccess: boolean;

    constructor(private registerService: RegisterService, private fb: FormBuilder) {
        this.model = new Account("", "", "");
        this.isRegisterSuccess = false;
    }

    ngOnInit() {
        this.form = this.fb.group({
            username: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
            password: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
            email: ['', Validators.compose([Validators.required, isSFUEmail])],
            phoneNumber: ['', isPhoneNumber]
        });

        this.registerService.isRegisterSuccess().subscribe((isRegisterSuccess: boolean) => {
            this.isRegisterSuccess = isRegisterSuccess;
        });
    }

    onSubmit() {
        this.model.UserName = this.form.value.username;
        this.model.Password = this.form.value.password;
        this.model.EmailAddress = this.form.value.email;
        if (this.form.value.phoneNumber !== '') {
            this.model.PhoneNumber = this.form.value.phoneNumber;
        } else {
            this.model.PhoneNumber = undefined;
        }
        this.registerService.register(this.model);
    }

}

function isSFUEmail(c: FormControl) {
    const EMAIL_REGEX = /@sfu.ca\s*$/;

    return EMAIL_REGEX.test(c.value) ? null : {
        isSFUEmail: {
            valid: false
        }
    }
}

function isPhoneNumber(c: FormControl) {
    if (c.value === '') {
        return null;
    }

    // From: https://stackoverflow.com/a/7288047
    const PHONE_REGEX = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/
    return PHONE_REGEX.test(c.value) ? null : {
        isPhoneNumber: {
            valid: false
        }
    }
}
