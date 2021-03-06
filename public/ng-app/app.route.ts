/**
 * Created by BHI on 2016-08-17.
 */
import { Routes, RouterModule } from '@angular/router';
import {ManagerStreamFiles} from "./manager/manager-streamfiles";
import {ManagerTranscoder} from "./manager/manager-transcoder.component";
import {ManagerBlank} from "./manager/manager-blank.component";
import {Manager} from "./manager/manager.component";

const appRoutes: Routes = [
    {
        path: 'manager',
        children: [
            {
                path: '',
                component: ManagerBlank
            },
            {
                path: ':id',
                component: ManagerBlank
            },
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

export const appRouting = RouterModule.forRoot(appRoutes);