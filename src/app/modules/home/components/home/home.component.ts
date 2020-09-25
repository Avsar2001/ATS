import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { News } from 'src/app/shared/models/news.model';
import { Event } from 'src/app/shared/models/event.model';

import { NewsService } from '../../services/news/news.service';

import { Job } from 'src/app/shared/models/job.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { JobService } from 'src/app/modules/job/services/job/job.service';
import { EventService } from 'src/app/modules/event/services/event/event.service';
import { SessionService } from 'src/app/core/services/session/session.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from 'src/app/modules/login/components/login/login.component';
import { RegisterComponent } from 'src/app/modules/login/components/register/register.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public eventsList: Event[] = [
  ];
  public event: any;

  public news: News[] = [

  ];
  public currentNews: any;

  public jobCards: Job[] = [

  ];
  public job: any;

  public isUserLoggedIn: boolean;

  constructor(config: NgbCarouselConfig, private eventService: EventService,
    private newsService: NewsService, private jobService: JobService,
    private spinner: NgxSpinnerService,
    private sessionService: SessionService,
    private dialog: MatDialog) {

    config.interval = 3500;
    config.wrap = true;
    config.keyboard = false;
    config.pauseOnHover = false;
    config.showNavigationIndicators = true;
    config.showNavigationArrows = true;

    this.list = [
      { rows: "1", cols: "1", data: "1", height: "270px" },
      { rows: "1", cols: "1", data: "1", height: "300px" },
      { rows: "1", cols: "1", data: "1", height: "270px" },
      { rows: "1", cols: "1", data: "1", height: "300px" }
    ];

  }

  ngOnInit(): void {
    //for showing spinner
    this.spinner.show();

    this.isUserLoggedIn = this.sessionService.getLoginState() === "false" || this.sessionService.getLoginState() === null ? false : true;

    this.eventService.getAllEvents().subscribe(events => {

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

      })
    });

    this.newsService.getAllNews().subscribe(news => {
      news.docs.map(data => {
        this.currentNews = data.data();
        this.currentNews.id = data.id;
        this.currentNews.createdOn = this.currentNews.createdOn.toDate();
        this.news.push(this.currentNews);
        // console.log(this.currentNews);
      })
    });

    this.jobService.getAllJobs().subscribe(jobs => {
      jobs.docs.map(data => {

        this.job = data.data();
        if (this.job.verificationStatus === true) {
          this.job.dueDate = this.job.dueDate.toDate();
          this.job.postedDate = this.job.postedDate.toDate();
          this.job.id = data.id;
          this.jobCards.push(this.job);
          // console.log(this.job);
        }

        this.spinner.hide();
      })
    });


  }

  openLogin() {
    this.dialog.open(LoginComponent, {
      disableClose: true,
      id: "loginDialog"
    });

  }

  openRegister() {
    this.dialog.open(RegisterComponent, {
      disableClose: true,
      id: "registerDialog"
    });
  }

  title = 'ATS';
  public list = [];

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    autoplay: true,
    autoplayHoverPause: true,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 1
      }
    },
    nav: false
  };
}
