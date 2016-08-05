/**
 * Created by manager on 2016-08-03.
 */
import { XHRBackend } from '@angular/http';
import { InMemoryBackendService, SEED_DATA } from 'angular2-in-memory-web-api';
import { InMemoryDataService } from './in-memory-data.service';

import { bootstrap }    from '@angular/platform-browser-dynamic';
import { HTTP_PROVIDERS } from '@angular/http';

import { AppComponent } from './app.component';
import { appRouterProvider } from './app.routes';

bootstrap(AppComponent, [
    appRouterProvider,
    HTTP_PROVIDERS,
    { provide: XHRBackend, useClass: InMemoryBackendService }, // in-memory server
    { provide: SEED_DATA, useClass: InMemoryDataService } // in-memory server data
]);