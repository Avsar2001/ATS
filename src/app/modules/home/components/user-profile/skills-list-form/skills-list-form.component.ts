import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SessionService } from 'src/app/core/services/session/session.service';
import { UserService } from 'src/app/core/services/user/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/shared/models/user.model';
import { ConfirmDialogModel, ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/shared/models/error-state-matcher.model';

@Component({
  selector: 'app-skills-list-form',
  templateUrl: './skills-list-form.component.html',
  styleUrls: ['./skills-list-form.component.css']
})
export class SkillsListFormComponent implements OnInit {

  currentUser: User;
  skillsList: string[] = [];
  skillsForm: FormGroup;
  matcher = new MyErrorStateMatcher();

  constructor(
    private dialog: MatDialog,
    private session: SessionService,
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) private parentData,
    private fb: FormBuilder) {

  }

  ngOnInit(): void {
    this.spinner.show();

    //for getting user from parent
    this.currentUser = this.parentData.user;
    if (this.currentUser.skills) {
      this.skillsList.push(...this.currentUser.skills);
    }

    this.skillsForm = this.fb.group({
      skill: this.fb.control("", Validators.required)
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
        this.dialog.getDialogById('skillsFormDialog').close();
      }
    });
  }

  //to remove perticula skill
  removeSkill(index: number) {
    this.skillsList.splice(index, 1);
  }

  //to add skill
  addSkill() {
    if (this.skillsForm.valid) {
      this.skillsList.push(this.skillsForm.value.skill);
      this.skillsForm.get('skill').reset();
    }
  }

  //to submit the data
  onSubmit() {

    this.spinner.show();

    this.currentUser.skills = this.skillsList;

    // to add this new user detail into session storage
    this.session.saveUser(this.currentUser);

    //to save user into firestore
    const id = this.session.getId();
    this.userService.updateUser(id, this.currentUser);

    //to close the form dialog
    this.dialog.getDialogById('skillsFormDialog').close();

    this.spinner.hide();

    //to show sucess message of login on home page 
    this.snackBar.open('Your Skills Updated Successfully', 'Thanks!! ', {
      duration: 8000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['notif-success']
    });
  }

}
