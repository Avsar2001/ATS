import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/shared/models/error-state-matcher.model';
import { MatDialog } from '@angular/material/dialog';
import { SessionService } from 'src/app/core/services/session/session.service';

import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogModel, ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { Job } from 'src/app/shared/models/job.model';
import { JobService } from '../../services/job/job.service';


@Component({
  selector: 'app-create-job-form',
  templateUrl: './create-job-form.component.html',
  styleUrls: ['./create-job-form.component.css']
})
export class CreateJobFormComponent implements OnInit {
  jobForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  job: Job;
  startDate = new Date(2011, 0, 1);

  constructor(private dialog: MatDialog,
    private fb: FormBuilder,
    private session: SessionService,
    private spinner: NgxSpinnerService,
    private snackBar: MatSnackBar,
    private jobService: JobService) { }

  ngOnInit(): void {
    this.spinner.show();

    //to build form
    this.jobForm = this.fb.group({
      jobTitle: this.fb.control("", [Validators.required]),
      description: this.fb.control("", [Validators.required]),
      dueDate: this.fb.control("", [Validators.required]),
      city: this.fb.control("", [Validators.required]),
      state: this.fb.control("", [Validators.required]),
      country: this.fb.control("", [Validators.required]),
      experience: this.fb.control("", [Validators.required]),
      payPerAnnum: this.fb.control("", []),
      qualification: this.fb.control("", [Validators.required]),
      website: this.fb.control("", [Validators.required]),
      jobType: this.fb.control("", [Validators.required]),
    });

    this.spinner.hide();
  }

  //data for confirm dialog
  data = new ConfirmDialogModel();
  //for closing experience form dialog via close button
  close() {
    this.data.title = "Are You sure you want to do this?";
    this.data.message = `This May lose your form data.`;
    this.dialog.open(ConfirmDialogComponent, {
      id: "confirmDialog",
      maxWidth: "500px",
      data: this.data,
      position: {
        top: '30px'
      }
    });

    this.dialog.getDialogById("confirmDialog").afterClosed().subscribe(returnedData => {
      if (returnedData) {
        this.dialog.getDialogById('jobFormDialog').close();
      }
    });
  }

  onSubmit() {
    if (this.jobForm.valid) {
      this.spinner.show();

      this.job = this.jobForm.value;
      this.job.authorId = this.session.getId();
      this.job.postedDate = new Date();
      this.job.verificationStatus = false;

      this.jobService.saveJob(this.job);

      //to close the form dialog
      this.dialog.getDialogById('jobFormDialog').close();

      this.spinner.hide();

      this.snackBar.open('Job Verfication By Admin is pending!', 'Okk!! ', {
        duration: 8000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['notif-alert']
      });

    }
  }
}
