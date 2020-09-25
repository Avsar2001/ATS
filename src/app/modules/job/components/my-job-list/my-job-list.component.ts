import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, of } from 'rxjs';
import { SessionService } from 'src/app/core/services/session/session.service';
import { Job } from 'src/app/shared/models/job.model';
import { JobService } from '../../services/job/job.service';

@Component({
  selector: 'app-my-job-list',
  templateUrl: './my-job-list.component.html',
  styleUrls: ['./my-job-list.component.css']
})
export class MyJobListComponent implements OnInit {

  public jobCards: Job[] = [];
  public job: any;
  public author: Observable<any>;

  constructor(private jobService: JobService,
    private spinner: NgxSpinnerService,
    private sessionService: SessionService) { }

  ngOnInit(): void {
    this.spinner.show();

    const currentUserId = this.sessionService.getId();
    this.author = of(this.sessionService.getUser());

    this.jobService.getJobByUserId(currentUserId).subscribe(data => {
      data.docs.map(jobs => {
        this.job = jobs.data();

        this.job.dueDate = this.job.dueDate.toDate();
        this.job.postedDate = this.job.postedDate.toDate();
        this.job.id = jobs.id;
        this.jobCards.push(this.job);

        this.spinner.hide();
      })
    })
    this.spinner.hide();
  }

}
