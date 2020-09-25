import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { MyErrorStateMatcher } from 'src/app/shared/models/error-state-matcher.model';
import { User, ExperienceInfo } from 'src/app/shared/models/user.model';
import { SessionService } from 'src/app/core/services/session/session.service';
import { UserService } from 'src/app/core/services/user/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-experience-form',
  templateUrl: './experience-form.component.html',
  styleUrls: ['./experience-form.component.css']
})
export class ExperienceFormComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private dialog: MatDialog,
    private session: SessionService,
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) private parentData) { }

  ngOnInit(): void {
    this.spinner.show();

    //for getting user from parent
    this.currentUser = this.parentData.user;
    //deciding for edit or add
    if (this.parentData.isCallForEdit) {
      this.index = this.parentData.index;
    }

    //Experience form group
    if (!this.parentData.isCallForEdit) {
      this.experienceForm = this.fb.group({
        position: this.fb.control("", [Validators.required]),
        company: this.fb.control("", [Validators.required]),
        jobType: this.fb.control("", [Validators.required]),
        join: this.fb.control("", [Validators.required]),
        out: this.fb.control("", [Validators.required]),
        jobCity: this.fb.control("", [Validators.required]),
        jobState: this.fb.control("", [Validators.required]),
        jobCountry: this.fb.control("", [Validators.required]),
        jobInfo: this.fb.control("", [])
      });
    }
    else {
      //Experience form group
      this.experienceForm = this.fb.group({
        position: this.fb.control(this.currentUser.experience[this.index].position, [Validators.required]),
        company: this.fb.control(this.currentUser.experience[this.index].company, [Validators.required]),
        jobType: this.fb.control(this.currentUser.experience[this.index].jobType, [Validators.required]),
        join: this.fb.control(this.currentUser.experience[this.index].join, [Validators.required]),
        out: this.fb.control(this.currentUser.experience[this.index].out, [Validators.required]),
        jobCity: this.fb.control(this.currentUser.experience[this.index].jobCity, [Validators.required]),
        jobState: this.fb.control(this.currentUser.experience[this.index].jobState, [Validators.required]),
        jobCountry: this.fb.control(this.currentUser.experience[this.index].jobCountry, [Validators.required]),
        jobInfo: this.fb.control(this.currentUser.experience[this.index].jobInfo, [])
      });
    }


    this.spinner.hide();
  }
  //for experience arrays index
  index: number;

  experienceForm: FormGroup;
  matcher = new MyErrorStateMatcher();

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
        this.dialog.getDialogById('experienceFormDialog').close();
      }
    });
  }

  startDate = new Date(2011, 0, 1);
  currentUser;

  onSubmit() {
    if (this.experienceForm.valid) {
      this.spinner.show();

      if (this.currentUser.experience && !this.parentData.isCallForEdit) {
        this.currentUser.experience.push(this.experienceForm.value as ExperienceInfo);
      }
      else if (this.currentUser.experience && this.parentData.isCallForEdit) {
        this.currentUser.experience.splice(this.index, 1, this.experienceForm.value as ExperienceInfo);
      }
      else {
        this.currentUser.experience = [];
        this.currentUser.experience.push(this.experienceForm.value as ExperienceInfo);
      }
      // to add this new user detail into session storage
      this.session.saveUser(this.currentUser);

      //to save user into firestore
      const id = this.session.getId();
      this.userService.updateUser(id, this.currentUser);

      //to close the form dialog
      this.dialog.getDialogById('experienceFormDialog').close();

      this.spinner.hide();

      //to show sucess message of login on home page 
      this.snackBar.open('Your Experience Added Successfully', 'Thanks!! ', {
        duration: 8000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['notif-success']
      });
    }
  }
}
