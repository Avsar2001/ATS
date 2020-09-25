import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SessionService } from 'src/app/core/services/session/session.service';

import { UserService } from 'src/app/core/services/user/user.service';
import { EventService } from '../../services/event/event.service';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {

  constructor(private eventService: EventService, private route: ActivatedRoute,
    private router: Router, private spinner: NgxSpinnerService,
    private userService: UserService,
    private sessionService: SessionService) { }

  public event;
  private id: string;
  public createdByUser;
  public isAttende: boolean = false;

  ngOnInit(): void {
    this.spinner.show();

    this.route.paramMap.subscribe(data => {
      this.spinner.show();

      this.id = data.get('id');
      // console.log(this.id);
      this.eventService.getEvent(this.id.trim()).subscribe(data => {
        if (data.exists) {
          this.event = data.data();

          this.event.id = data.id;
          this.event.createdDate = this.event.createdDate.toDate();
          this.event.eventDate = this.event.eventDate.toDate();

          //for geting user detail who created event
          this.userService.getUserById(this.event.createdById).subscribe(data => {
            this.createdByUser = data.data();
          });

          //to check is this user is attende of this event
          if (this.event.attende.indexOf(this.sessionService.getId()) != -1) {
            this.isAttende = true;
          }


          this.spinner.hide();
        }
        else {
          this.spinner.hide();
          this.router.navigate(['../home']);
          console.error("Event dosen't exist");
        }
      });
      this.spinner.hide();
    });


  }


  entryAttende() {
    if (this.event.attende.indexOf(this.sessionService.getId()) == -1) {
      this.event.attende.push(this.sessionService.getId());
      //to save this event
      this.eventService.updateEvent(this.event.id, this.event);
      this.isAttende = true;
    }
  }
}
