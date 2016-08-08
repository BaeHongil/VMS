/**
 * Created by manager on 2016-08-08.
 */
import { Component } from '@angular/core';
import { ManagerStreamFiles } from './manager-streamfiles';

@Component({
    selector: 'manager-pane',
    templateUrl: 'ng-app/manager/manager.component.html',
    directives: [ManagerStreamFiles]
})
export class Manager {

}