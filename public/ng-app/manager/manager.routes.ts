/**
 * Created by manager on 2016-08-12.
 */
import { Routes, RouterModule } from '@angular/router';
import { ManagerStreamFiles } from './manager-streamfiles';
import { ManagerTranscoder } from './manager-transcoder.component';
import { ManagerBlank } from "./manager-blank.component";
import { Manager } from "./manager.component";

const managerRoutes: Routes = [
    {
        path: 'manager',
        component: Manager,
        children: [
            {
                path: 'streamfiles/:id',
                component: ManagerStreamFiles
            },
            {
                path: 'transcoder/:id',
                component: ManagerTranscoder
            },
            {
                path: ':id',
                component: ManagerBlank
            }
        ]
    }
];

export const managerRouting = RouterModule.forChild(managerRoutes);