import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/shared/models/error-state-matcher.model';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SessionService } from 'src/app/core/services/session/session.service';
import { UserService } from 'src/app/core/services/user/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/shared/models/user.model';
import { ConfirmDialogModel, ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-personal-info-form',
  templateUrl: './personal-info-form.component.html',
  styleUrls: ['./personal-info-form.component.css']
})
export class PersonalInfoFormComponent implements OnInit {
  personalForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  currentUser: User;

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

    //personal info form group
    this.personalForm = this.fb.group({
      firstName: this.fb.control(this.currentUser.personal.firstName, [Validators.required]),
      lastName: this.fb.control(this.currentUser.personal.lastName, [Validators.required]),
      enrollment: this.fb.control(this.currentUser.personal.enrollment, [Validators.required, Validators.pattern("^[0-9]*$")]),
      gender: this.fb.control(this.currentUser.personal.gender, [Validators.required]),
      bio: this.fb.control(this.currentUser.personal.bio, [])
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
        this.dialog.getDialogById('personalFormDialog').close();
      }
    });
  }

  //to submit the data
  onSubmit() {
    if (this.personalForm.valid) {
      this.spinner.show();

      this.currentUser.personal = this.personalForm.value;

      // to add this new user detail into session storage
      this.session.saveUser(this.currentUser);

      //to save user into firestore
      const id = this.session.getId();
      this.userService.updateUser(id, this.currentUser);

      //to close the form dialog
      this.dialog.getDialogById('personalFormDialog').close();

      this.spinner.hide();

      //to show sucess message of login on home page 
      this.snackBar.open('Your personal Info Updated Successfully', 'Thanks!! ', {
        duration: 8000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['notif-success']
      });
    }
  }
}
