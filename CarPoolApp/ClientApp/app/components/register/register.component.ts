import { Component } from '@angular/core';
import { Account } from './Account'

@Component({
    selector: 'register',
    templateUrl: './register.component.html'
})
export class RegisterComponent {
    model: Account = new Account("", "", "");

    onSubmit() {
        console.log(this.model);
    }
}
