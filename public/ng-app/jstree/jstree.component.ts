/**
 * Created by manager on 2016-08-08.
 */
import { Component, ElementRef, Renderer, Input, OnInit } from '@angular/core';
import { JstreeService } from './jstree.service';

export abstract class JsTree implements OnInit {
    @Input() jsTreeOpt: any;
    jsTree: any;
    type: string;
    changedJstreeFunc: Function;
    el: any;

    constructor(
        elementRef: ElementRef,
        private renderer: Renderer,
        protected jstreeService: JstreeService) {
        this.el = elementRef.nativeElement;
    }

    ngOnInit() {
        jQuery(this.el).jstree(this.jsTreeOpt);
        this.jsTree = jQuery(this.el).jstree();

        this.setChangedJsTreeListener();
    }

    setChangedJsTreeListener() {
        console.log('setchange');
        this.changedJstreeFunc = this.renderer.listen(this.el, 'changed.jstree', (e, data) => {
            console.log('listen');
            let selNode = data.instance.get_node(data.selected[0]);
            this.selectNode(selNode);
            /*if( this.type === 'VHost' )
                this.jstreeService.selectVhostNode(selNode);
            else if( this.type === 'Connection')
                this.jstreeService.selectConnNode(selNode);*/
        });
        jQuery(this.el).on('changed.jstree', (e, data) => {
            console.log('jQuery on');
            let selNode = data.instance.get_node(data.selected[0]);
            this.selectNode(selNode);
        });
    }

    abstract selectNode(selNode: any);
}