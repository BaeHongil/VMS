/**
 * Created by manager on 2016-08-08.
 */
import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { JstreeService } from './jstree.service';

export abstract class JsTree implements OnInit {
    @Input() jsTreeOpt: any;
    jsTree: JSTree;
    type: string;
    changedJstreeFunc: Function;
    el: any;

    constructor(
        elementRef: ElementRef,
        protected jstreeService: JstreeService) {
        this.el = elementRef.nativeElement;
    }

    ngOnInit() {
        jQuery(this.el).jstree(this.jsTreeOpt);
        this.jsTree = jQuery(this.el).jstree(true);

        this.setChangedJsTreeListener();
    }

    setChangedJsTreeListener() {
        jQuery(this.el).on('changed.jstree', (e, data) => {
            let selNode = data.instance.get_node(data.selected[0]);
            this.selectNode(selNode);
        });
    }

    abstract selectNode(selNode: any);
}