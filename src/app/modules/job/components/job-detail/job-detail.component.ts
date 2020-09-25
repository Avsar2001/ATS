import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { map } from 'rxjs/operators';
import { UserService } from 'src/app/core/services/user/user.service';
import { JobService } from '../../services/job/job.service';


@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.css']
})
export class JobDetailComponent implements OnInit {

  constructor(private jobService: JobService, private route: ActivatedRoute,
    private router: Router, private spinner: NgxSpinnerService,
    private userService: UserService) { }

  public job: any;
  public authorProfileImage: string;

  ngOnInit(): void {
    this.spinner.show();

    this.route.paramMap.subscribe(data => {
      this.id = data.get('id');
    });

    this.jobService.getJobById(this.id.trim()).subscribe(data => {
      if (data.exists) {
        this.job = data.data();
        this.job.id = this.id;
        this.job.postedDate = this.job.postedDate.toDate();
        this.job.dueDate = this.job.dueDate.toDate();

        //for profile img
        this.userService.getUserById(this.job.authorId).subscribe(data => {
          this.authorProfileImage = data.data().profileImage;
        })

        this.spinner.hide();
      }
      else {
        this.spinner.hide();

        this.router.navigate(['../home']);
        console.error("Job dosen't Exist");
      }
    });
  }
  public id: string;
}
