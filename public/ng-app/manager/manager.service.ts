/**
 * Created by manager on 2016-08-08.
 */
import { Injectable } from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Rx";
import {StreamFile, ConnectConfig} from "./streamfile";

@Injectable()
export class ManagerService {
    private managerVisibleSubs = new Subject<boolean>();

    managerVisible$ = this.managerVisibleSubs.asObservable();

    constructor(private http: Http) { }

    setManagerVisible(visible: boolean) {
        this.managerVisibleSubs.next(visible);
    }

    getStreamFiles(vhostName: string, appName: string): Observable<StreamFile[]> {
        let streamFilesObsv = this.http.get(`vms/${vhostName}/${appName}/streamfiles`)
            .map( (res: Response) => res.json());
        return streamFilesObsv;
    }

    postStreamFile(vhostName: string, appName: string, body: any): Observable<string> {
        let headers = new Headers({
            'Content-Type': 'application/json'
        });

        return this.http
            .post(`vms/${vhostName}/${appName}/streamfiles`, JSON.stringify(body), { headers: headers })
            .map( (res: Response) => res.status )
            .catch(this.handleError);
    }

    putStreamFile(vhostName: string, appName: string, streamFileName: string, streamFile: StreamFile): Observable<string> {
        let headers = new Headers({
            'Content-Type': 'application/json'
        });

        return this.http
            .put(`vms/${vhostName}/${appName}/streamfiles/${streamFileName}`, JSON.stringify(streamFile), { headers: headers })
            .map( (res: Response) => res.status )
            .catch(this.handleError);
    }

    deleteStreamFile(vhostName: string, appName: string, streamFileName: string): Observable<string> {
        let headers = new Headers({
            'Content-Type': 'application/json'
        });

        return this.http
            .delete(`vms/${vhostName}/${appName}/streamfiles/${streamFileName}`, { headers: headers })
            .map( (res: Response) => res.status )
            .catch(this.handleError);
    }

    connectStreamFile(vhostName: string, appName: string, streamFileName: string, connectConfig: ConnectConfig): Observable<string> {
        let headers = new Headers({
            'Content-Type': 'application/json'
        });

        return this.http
            .put(`vms/${vhostName}/${appName}/streamfiles/${streamFileName}/actions/connect`, JSON.stringify(connectConfig), { headers: headers })
            .map( (res: Response) => res.status )
            .catch(this.handleError);
    }

    private handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(error);
    }
}