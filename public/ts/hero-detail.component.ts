/**
 * Created by manager on 2016-08-04.
 */
import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core'
import { ActivatedRoute } from '@angular/router';

import { HeroService } from './hero.service';
import { Hero } from './hero';

@Component({
    selector: 'my-hero-detail',
    templateUrl: 'ts/hero-detail.component.html',
    styleUrls: ['ts/hero-detail.component.css']
})

export class HeroDetailComponent implements OnInit, OnDestroy {
    @Input() hero: Hero;
    @Output() close = new EventEmitter();
    error: any;
    sub: any;
    navigated = false;

    constructor(
        private heroService: HeroService,
        private route: ActivatedRoute) {

    }

    ngOnInit(){
        this.sub = this.route.params.subscribe(params => {
            if (params['id'] !== undefined ) {
                let id = +params['id'];
                this.navigated = true;
                this.heroService.getHero(id)
                    .then(hero => this.hero = hero);
            } else {
                this.navigated = false;
                this.hero = new Hero();
            }
        });
    }
    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    goBack(savedHero: Hero = null) {
        this.close.emit(savedHero);
        if (this.navigated) { window.history.back() };
    }

    save() {
        this.heroService
            .save(this.hero)
            .then(hero => {
                this.hero = hero;
                this.goBack(hero);
            })
            .catch(error => this.error = error);
    }
}