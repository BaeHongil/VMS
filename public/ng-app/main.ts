/**
 * Created by manager on 2016-08-08.
 */
import { bootstrap } from '@angular/platform-browser-dynamic';
import { AppComponent } from './app.component';
import { HTTP_PROVIDERS } from '@angular/http';

bootstrap(AppComponent, [
    HTTP_PROVIDERS
]);