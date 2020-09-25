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
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent implements OnInit {

  contactForm: FormGroup;
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

    //to build form
    this.contactForm = this.fb.group({
      email: this.fb.control(this.currentUser.contact.email, [Validators.required, Validators.email]),
      phone: this.fb.control(this.currentUser.contact.phone, [Validators.required, Validators.pattern("[0-9]+"), Validators.minLength(10), Validators.maxLength(10)]),
      address1: this.fb.control(this.currentUser.contact.address1, [Validators.required, Validators.maxLength(256)]),
      address2: this.fb.control(this.currentUser.contact.address2, [Validators.maxLength(256)]),
      city: this.fb.control(this.currentUser.contact.city, [Validators.required]),
      state: this.fb.control(this.currentUser.contact.state, [Validators.required]),
      country: this.fb.control(this.currentUser.contact.country, [Validators.required]),
      postal: this.fb.control(this.currentUser.contact.postal, [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern("^[0-9]*$")])
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
        this.dialog.getDialogById('contactFormDialog').close();
      }
    });
  }

  //to submit the data
  onSubmit() {
    if (this.contactForm.valid) {
      this.spinner.show();

      this.currentUser.contact = this.contactForm.value;

      // to add this new user detail into session storage
      this.session.saveUser(this.currentUser);

      //to save user into firestore
      const id = this.session.getId();
      this.userService.updateUser(id, this.currentUser);

      //to close the form dialog
      this.dialog.getDialogById('contactFormDialog').close();

      this.spinner.hide();

      //to show sucess message of login on home page 
      this.snackBar.open('Your Contact Info Updated Successfully', 'Thanks!! ', {
        duration: 8000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['notif-success']
      });
    }
  }
}
