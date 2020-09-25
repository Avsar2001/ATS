import { NgModule } from '@angular/core';

import { EventRoutingModule } from './event-routing.module';
import { EventDetailComponent } from './components/event-detail/event-detail.component';
import { EventsComponent } from './components/events/events.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreateEventFormComponent } from './components/create-event-form/create-event-form.component';
import { MyEventListComponent } from './components/my-event-list/my-event-list.component';


@NgModule({
  declarations: [
    EventDetailComponent,
    EventsComponent,
    CreateEventFormComponent,
    MyEventListComponent
  ],
  imports: [
    EventRoutingModule,
    SharedModule
  ],
  entryComponents: [
    CreateEventFormComponent
  ]
})
export class EventModule { }
