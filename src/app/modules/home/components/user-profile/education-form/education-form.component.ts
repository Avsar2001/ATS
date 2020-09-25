import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/shared/models/error-state-matcher.model';
import { ConfirmDialogModel, ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SessionService } from 'src/app/core/services/session/session.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { UserService } from 'src/app/core/services/user/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { User, AcademicInfo } from 'src/app/shared/models/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-education-form',
  templateUrl: './education-form.component.html',
  styleUrls: ['./education-form.component.css']
})
export class EducationFormComponent implements OnInit {

  educationForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  startDate = new Date(2011, 0, 1);
  //for experience arrays index
  index: number;


  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
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

    //Education form group
    if (!this.parentData.isCallForEdit) {
      this.educationForm = this.fb.group({
        collegeName: this.fb.control("", [Validators.required]),
        degree: this.fb.control("", [Validators.required]),
        branch: this.fb.control("", [Validators.required]),
        join: this.fb.control("", [Validators.required]),
        compelete: this.fb.control("", [Validators.required]),
        city: this.fb.control("", [Validators.required]),
        state: this.fb.control("", [Validators.required]),
        country: this.fb.control("", [Validators.required]),
        description: this.fb.control("", [])
      });
    }
    else {
      this.educationForm = this.fb.group({
        collegeName: this.fb.control(this.currentUser.academic[this.index].collegeName, [Validators.required]),
        degree: this.fb.control(this.currentUser.academic[this.index].degree, [Validators.required]),
        branch: this.fb.control(this.currentUser.academic[this.index].branch, [Validators.required]),
        join: this.fb.control(this.currentUser.academic[this.index].join, [Validators.required]),
        compelete: this.fb.control(this.currentUser.academic[this.index].compelete, [Validators.required]),
        city: this.fb.control(this.currentUser.academic[this.index].city, [Validators.required]),
        state: this.fb.control(this.currentUser.academic[this.index].state, [Validators.required]),
        country: this.fb.control(this.currentUser.academic[this.index].country, [Validators.required]),
        description: this.fb.control(this.currentUser.academic[this.index].description, [])
      });
    }


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
        this.dialog.getDialogById('educationFormDialog').close();
      }
    });
  }

  currentUser: User;
  //to submit the data
  onSubmit() {
    if (this.educationForm.valid) {
      this.spinner.show();

      if (this.currentUser.academic && !this.parentData.isCallForEdit) {
        this.currentUser.academic.push(this.educationForm.value as AcademicInfo);
      }
      else if (this.currentUser.academic && this.parentData.isCallForEdit) {
        this.currentUser.academic.splice(this.index, 1, this.educationForm.value as AcademicInfo);
      }
      else {
        this.currentUser.academic = [];
        this.currentUser.academic.push(this.educationForm.value as AcademicInfo);
      }
      // to add this new user detail into session storage
      this.session.saveUser(this.currentUser);

      //to save user into firestore
      const id = this.session.getId();
      this.userService.updateUser(id, this.currentUser);

      //to close the form dialog
      this.dialog.getDialogById('educationFormDialog').close();

      this.spinner.hide();

      //to show sucess message of login on home page 
      this.snackBar.open('Your Education Added Successfully', 'Thanks!! ', {
        duration: 8000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['notif-success']
      });
    }
  }
}
