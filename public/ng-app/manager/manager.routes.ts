/**
 * Created by manager on 2016-08-12.
 */
import { RouterConfig, provideRouter } from '@angular/router';
import { ManagerStreamFiles } from './manager-streamfiles';
import { ManagerTranscoder } from './manager-transcoder.component';

const routerConfig: RouterConfig = [
    {
        path: 'manager',
        children: [
            {
                path: 'streamfiles/:id',
                component: ManagerStreamFiles
            },
            {
                path: 'transcoder/:id',
                component: ManagerTranscoder
            }
        ]
    }
];

export const managerRouterProvider = [
    provideRouter(routerConfig)
];