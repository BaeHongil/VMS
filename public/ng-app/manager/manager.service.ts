/**
 * Created by manager on 2016-08-08.
 */
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Rx";

@Injectable()
export class ManagerService {
    private managerVisibleSubs = new Subject<boolean>();

    managerVisible$ = this.managerVisibleSubs.asObservable();

    constructor(private http: Http) { }

    setManagerVisible(visible: boolean) {
        this.managerVisibleSubs.next(visible);
    }

    getStreamFiles(vhostName: string, appName: string): Observable<Object> {
        let streamFilesObsv = this.http.get(`vms/${vhostName}/${appName}/streamfiles`)
            .map( (r:Response) => r.json());
        return streamFilesObsv;
    }
}