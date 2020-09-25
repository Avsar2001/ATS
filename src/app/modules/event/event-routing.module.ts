import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { EventDetailComponent } from './components/event-detail/event-detail.component';
import { EventsComponent } from './components/events/events.component';
import { MyEventListComponent } from './components/my-event-list/my-event-list.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Event'
    },
    children: [
      {
        path: 'events',
        component: EventsComponent
      },
      {
        path: 'events/:id',
        component: EventDetailComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'myEvents',
        component: MyEventListComponent,
        canActivate: [AuthGuard]
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventRoutingModule { }
