import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { debounceTime, map } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user.model';
import { RegisterService } from '../../services/register/register.service';
import { ConfirmDialogModel, ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MyErrorStateMatcher } from 'src/app/shared/models/error-state-matcher.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  personalInfo: FormGroup;
  contactInfo: FormGroup;
  accountInfo: FormGroup;
  isLinear = true;
  matcher = new MyErrorStateMatcher();

  constructor(private fb: FormBuilder, private afs: AngularFirestore,
    private registerService: RegisterService,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private router: Router,
    private snackBar: MatSnackBar) {

  }

  ngOnInit(): void {
    this.spinner.show();

    //personal info form group
    this.personalInfo = this.fb.group({
      firstName: this.fb.control('', [Validators.required]),
      lastName: this.fb.control('', [Validators.required]),
      enrollment: this.fb.control('', [Validators.required, Validators.pattern("^[0-9]*$")]),
      gender: this.fb.control('', [Validators.required]),
      bio: this.fb.control('', [])
    });

    //contact info form group
    this.contactInfo = this.fb.group({
      email: this.fb.control('', [Validators.required, Validators.email]),
      phone: this.fb.control('', [Validators.required, Validators.pattern("[0-9]+"), Validators.minLength(10), Validators.maxLength(10)]),
      address1: this.fb.control('', [Validators.required, Validators.maxLength(256)]),
      address2: this.fb.control('', [Validators.maxLength(256)]),
      city: this.fb.control('', [Validators.required]),
      state: this.fb.control('', [Validators.required]),
      country: this.fb.control('', [Validators.required]),
      postal: this.fb.control('', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern("^[0-9]*$")])
    });

    //account info form group
    this.accountInfo = this.fb.group({
      username: this.fb.control('', [Validators.required]),
      password: this.fb.control('', [Validators.required, Validators.pattern(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[" !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"]).{8,25}$/)]),

    });

    this.spinner.hide();
  }

  public status;

  username($event) {
    this.status = "checking";
    const uname = $event.target.value.trim();

    this.afs.collection('users', ref => ref.where('username', '==', uname))
      .get().pipe(
        debounceTime(500),
        map(data => {
          this.status = "";
          data.empty ? null : this.accountInfo.get('username').setErrors({ taken: true });
        })
      ).subscribe(data => {
      });
  }

  private user: User = new User();

  onSubmit() {
    this.spinner.show();

    //account info
    this.user.username = this.accountInfo.get('username').value;
    this.user.password = this.accountInfo.get('password').value;
    this.user.status = false;
    //personal info
    this.user.personal = this.personalInfo.value;
    //contact info
    this.user.contact = this.contactInfo.value;

    // console.log(this.user);
    this.registerService.saveUser(this.user);

    this.spinner.hide();
    //to close register and redirect to home page.
    this.dialog.getDialogById('registerDialog').close();
    this.router.navigate(['./home']);

    //to show sucess message of registration on home page 
    this.snackBar.open('Congratulations! Registration successful!!', 'End now', {
      duration: 8000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: 'notif-success'
    });
  }

  //data for confirm dialog
  data = new ConfirmDialogModel();

  //for closing register form dialog via close button
  close() {
    this.data.title = "Are You sure you want to do this?";
    this.data.message = `This May lose your form data.`;
    this.dialog.open(ConfirmDialogComponent, {
      id: "confirmDialog",
      maxWidth: "400px",
      data: this.data,
      position: {
        top: '30px'
      }
    });

    this.dialog.getDialogById("confirmDialog").afterClosed().subscribe(returnedData => {
      if (returnedData) {
        this.dialog.getDialogById('registerDialog').close();
      }
    });
  }

}


