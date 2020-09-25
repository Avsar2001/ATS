import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { JobDetailComponent } from './components/job-detail/job-detail.component';
import { JobsComponent } from './components/jobs/jobs.component';
import { MyJobListComponent } from './components/my-job-list/my-job-list.component';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Job'
        },
        children: [

            {
                path: 'jobs',
                component: JobsComponent
            },
            {
                path: 'jobs/:id',
                component: JobDetailComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'myJobs',
                component: MyJobListComponent,
                canActivate: [AuthGuard]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class JobRoutingModule { }
