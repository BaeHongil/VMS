/**
 * Created by manager on 2016-08-17.
 */
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'manager-blank',
    template: '<p *ngIf="id" class="bg-info">우측 메뉴를 선택해주세요.</p>'
})
export class ManagerBlank implements OnInit {
    id: string;
    constructor(private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.params.subscribe( params => {
            if( params['id'] )
                this.id = params['id'];
            else
                this.id = null;
        });
    }
}