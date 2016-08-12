/**
 * Created by manager on 2016-08-12.
 */
import { Injectable } from '@angular/core';
import { Subject } from "rxjs/Rx";

@Injectable()
export class NabTabService {
    private nabTabSelectedSubj = new Subject<string>();

    nabTabSelected$ = this.nabTabSelectedSubj.asObservable();

    selectNavTab(navTabName: string) {
        this.nabTabSelectedSubj.next(navTabName);
    }
}