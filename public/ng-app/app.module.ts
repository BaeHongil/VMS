/**
 * Created by manager on 2016-08-17.
 */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { appRouting } from "./app.route";
import {NabTabService} from "./nav-tab/nav-tab.service";
import {JstreeService} from "./jstree/jstree.service";
import {NavTabs} from "./nav-tab/nav-tabs.component";
import {VHostJsTree} from "./jstree/vhost-jstree.component";
import {ConnJsTree} from "./jstree/conn-jstree.component";
import {Players} from "./player/players.component";
import {Manager} from "./manager/manager.component";
import {ManagerService} from "./manager/manager.service";

@NgModule({
    declarations: [
        AppComponent,
        NavTabs,
        VHostJsTree,
        ConnJsTree,
        Players,
        Manager
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        appRouting
    ],
    providers: [
        NabTabService,
        JstreeService,
        ManagerService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }