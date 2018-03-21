import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { Carpool } from './carpool';
import { CARPOOLS } from './mock-carpools';

@Injectable()
export class CarpoolService {

  constructor() { }

  getCarpools(): Observable<Carpool[]> {
    return of(CARPOOLS);
  }
}
