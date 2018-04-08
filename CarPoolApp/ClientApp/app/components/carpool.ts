export class Carpool {

    id: number;
    driver: string;
    vehicle: string;
    seatsRemaining: number;
    campus: string;
    datetime: Date;

    constructor(driver: string, vehicle: string, seatsRemaining: number, campus: string, datetime: Date) {
        this.id = -1;
        this.driver = driver;
        this.vehicle = vehicle;
        this.seatsRemaining = seatsRemaining;
        this.campus = campus;
        this.datetime = datetime;
    }
}
