/**
 * Created by manager on 2016-08-05.
 */
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Hero } from './hero';

@Injectable()
export class HeroSearchService {
    constructor(private http: Http) { }

    search(term: string) {
        return this.http
            .get(`anything/heroes/?name=${term}`)
            .map( (r:Response) => r.json().data as Hero[] );
    }
}