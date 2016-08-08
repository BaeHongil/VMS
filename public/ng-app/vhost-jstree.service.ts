/**
 * Created by manager on 2016-08-08.
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class VHostJstreeService {
    private menuSelectedSubject = new Subject<string>();
    private nodeSelectedSubject = new Subject<Object>();

    menuSelected$ = this.menuSelectedSubject.asObservable();
    nodeSelected$ = this.nodeSelectedSubject.asObservable();

    selectMenu(menu: string) {
        this.menuSelectedSubject.next(menu);
    }

    selectNode(node: Object) {
        this.nodeSelectedSubject.next(node);
    }
}