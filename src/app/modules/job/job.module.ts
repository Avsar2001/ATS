import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreateJobFormComponent } from './components/create-job-form/create-job-form.component';
import { JobDetailComponent } from './components/job-detail/job-detail.component';
import { JobsComponent } from './components/jobs/jobs.component';
import { JobRoutingModule } from './job-routing.module';
import { MyJobListComponent } from './components/my-job-list/my-job-list.component';



@NgModule({
  declarations: [
    CreateJobFormComponent,
    JobsComponent,
    JobDetailComponent,
    MyJobListComponent
  ],
  imports: [
    SharedModule,
    JobRoutingModule
  ],
  entryComponents: [
    CreateJobFormComponent
  ]
})
export class JobModule { }
