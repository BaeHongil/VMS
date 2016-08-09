/**
 * Created by manager on 2016-08-09.
 */
import { Component, ElementRef, Renderer,  } from '@angular/core';
import { JsTree } from './jstree.component';
import { JstreeService } from './jstree.service';

@Component({
    selector: 'vhost-jstree',
    template: '<div></div>'
})
export class VHostJsTree extends JsTree {
    constructor(
        elementRef: ElementRef,
        renderer: Renderer,
        jstreeService: JstreeService) {
        super(elementRef, renderer, jstreeService);
    }

    selectNode(selNode:any) {
        this.jstreeService.selectVhostNode(selNode);
    }
}