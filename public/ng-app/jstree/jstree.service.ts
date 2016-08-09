/**
 * Created by manager on 2016-08-08.
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class JstreeService {
    private menuSelectedSubject = new Subject<string>();
    private vhostNodeSelectedSubject = new Subject<any>();
    private connNodeSelectedSubject = new Subject<any>();

    menuSelected$ = this.menuSelectedSubject.asObservable();
    vhostNodeSelected$ = this.vhostNodeSelectedSubject.asObservable();
    connNodeSelected$ = this.connNodeSelectedSubject.asObservable();

    selectMenu(menu: string) {
        this.menuSelectedSubject.next(menu);
    }

    selectVhostNode(node: any) {
        this.vhostNodeSelectedSubject.next(node);
    }

    selectConnNode(node: any) {
        this.connNodeSelectedSubject.next(node);
    }
}