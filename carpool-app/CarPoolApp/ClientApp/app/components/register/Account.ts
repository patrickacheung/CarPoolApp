export class Account {

    constructor(
        public UserName: string,
        public EmailAddress: string,
        public Password: string,
        public PhoneNumber?: string
    ) { }

}