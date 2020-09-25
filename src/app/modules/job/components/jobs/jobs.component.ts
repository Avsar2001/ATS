import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

import { JobService } from '../../services/job/job.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateJobFormComponent } from '../create-job-form/create-job-form.component';
import { UserService } from 'src/app/core/services/user/user.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {

  constructor(private jobService: JobService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private userService: UserService) { }

  ngOnInit(): void {
    this.spinner.show();

    this.jobService.getAllJobs().subscribe(jobs => {
      jobs.docs.map(data => {
        this.job = data.data();
        if (this.job.verificationStatus == true) {
          this.job.dueDate = this.job.dueDate.toDate();
          this.job.postedDate = this.job.postedDate.toDate();
          this.job.id = data.id;

          //for profile img
          this.job.authorId = this.userService.getUserById(this.job.authorId).pipe(
            map(data => {
              return data.data();
            })
          );
          this.jobCards.push(this.job);
          // console.log(this.job);
        }

        this.spinner.hide();
      })
    });

    // console.log(this.jobCards);
  }
  public jobCards: any[] = [];

  public job: any;

  //for adding experience info
  jobDialogRef;
  createJob() {
    this.jobDialogRef = this.dialog.open(CreateJobFormComponent, {
      disableClose: true,
      id: "jobFormDialog",
      maxWidth: "600px"
    });
  }
}
