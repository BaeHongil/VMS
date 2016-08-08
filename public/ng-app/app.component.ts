/**
 * Created by manager on 2016-08-05.
 */
import {Component, AfterViewInit, ElementRef} from '@angular/core';
import { Players } from './player/players.component';
import { Manager } from './manager/manager.component';
import { VHostJstreeService } from './vhost-jstree.service';

@Component({
    selector: 'vms-app',
    templateUrl: 'ng-app/app.component.html',
    directives: [Players, Manager],
    providers: [VHostJstreeService]
})
export class AppComponent implements AfterViewInit {
    constructor(private el: ElementRef) {

    }

    ngAfterViewInit() {
        var event = new Event('ngAfterViewInit');
        this.el.nativeElement.dispatchEvent(event);
    }
}