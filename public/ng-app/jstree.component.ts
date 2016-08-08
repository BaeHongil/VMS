/**
 * Created by manager on 2016-08-08.
 */
import { Component, ElementRef, Renderer, Input, OnInit } from '@angular/core';
import { VHostJstreeService } from './vhost-jstree.service';

@Component({
    selector: 'jstree'
})
export class JsTree implements OnInit {
    @Input() opt: any;
    jsTree: any;
    changedJstreeFunc: Function;

    constructor(
        private el: ElementRef,
        private renderer: Renderer,
        private vhostJstreeService: VHostJstreeService) { }

    ngOnInit() {
        jQuery(this.el).jstree(this.opt);
        this.jsTree = jQuery(this.el).jstree();

        this.setChangedJsTreeListener();
    }

    setChangedJsTreeListener() {
        this.changedJstreeFunc = this.renderer.listen(this.el, 'changed.jstree', (e, data) => {
            let selNode = data.instance.get_node(data.selected[0]);

            this.vhostJstreeService.selectNode(selNode);
        });
    }
}