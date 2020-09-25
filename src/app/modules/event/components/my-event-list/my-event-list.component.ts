import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SessionService } from 'src/app/core/services/session/session.service';
import { Event } from 'src/app/shared/models/event.model';
import { EventService } from '../../services/event/event.service';

@Component({
  selector: 'app-my-event-list',
  templateUrl: './my-event-list.component.html',
  styleUrls: ['./my-event-list.component.css']
})
export class MyEventListComponent implements OnInit {

  public eventsList: Event[] = [
  ];
  public event: any;

  constructor(private service: EventService,
    private spinner: NgxSpinnerService,
    private sessionService: SessionService) { }

  ngOnInit(): void {
    this.spinner.show();

    this.service.getEventByUserId(this.sessionService.getId())
      .subscribe(events => {
        events.docs.map(data => {

          this.event = data.data();

          this.event.createdDate = this.event.createdDate.toDate();
          this.event.eventDate = this.event.eventDate.toDate();
          this.event.id = data.id;
          this.eventsList.push(this.event);

        });
        this.spinner.hide();
      })

    console.log(this.eventsList);
  }

}
