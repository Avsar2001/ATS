import { Component, OnInit } from '@angular/core';
import { Event } from 'src/app/shared/models/event.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { EventService } from '../../services/event/event.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateEventFormComponent } from '../create-event-form/create-event-form.component';


@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  public eventsList: Event[] = [
  ];
  public event: any;

  constructor(private service: EventService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.spinner.show();

    this.service.getAllEvents().subscribe(events => {
      events.docs.map(data => {
        // console.log(data.payload.doc.id);
        // console.log(data.payload.doc.data());
        this.event = data.data();
        if (this.event.verificationStatus === true) {
          this.event.createdDate = this.event.createdDate.toDate();
          this.event.eventDate = this.event.eventDate.toDate();
          this.event.id = data.id;
          this.eventsList.push(this.event);
        }

        this.spinner.hide();
      })

    });
  }

  //for adding experience info
  eventDialogRef;
  createEvent() {
    this.eventDialogRef = this.dialog.open(CreateEventFormComponent, {
      disableClose: true,
      id: "eventFormDialog",
      maxWidth: "600px"
    });
  }
}
