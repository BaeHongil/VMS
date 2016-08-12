/**
 * Created by manager on 2016-08-12.
 */
import {Directive, ElementRef, HostListener, Input, Renderer, OnInit} from '@angular/core';
import {RouterLinkWithHref, Router, ActivatedRoute} from '@angular/router';
import {LocationStrategy} from "@angular/common";

@Directive({
    selector: 'router-directive'
})
export class RouterDirective extends RouterLinkWithHref {


    ngOnChanges(changes: {}): any {
        super.ngOnChanges(changes);
        this.urlTree.queryParams.skipLocationChange = 'a';
    }

    private updateTargetUrlAndHref(): void {
        this.urlTree = this.router.createUrlTree(this.commands, {
            relativeTo: this.route,
            queryParams: this.queryParams,
            fragment: this.fragment,
            preserveQueryParams: toBool(this.preserveQueryParams),
            preserveFragment: toBool(this.preserveFragment)
        });

        if (this.urlTree) {
            this.href = this.locationStrategy.prepareExternalUrl(this.router.serializeUrl(this.urlTree));
        }
    }
}