/**
 * Created by manager on 2016-08-03.
 */
import { bootstrap }    from '@angular/platform-browser-dynamic';

import { AppComponent } from './app.component';
import { appRouterProvider } from './app.routes';

bootstrap(AppComponent, [
    appRouterProvider
]);