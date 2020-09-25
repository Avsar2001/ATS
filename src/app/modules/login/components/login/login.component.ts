import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { debounceTime, map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/shared/models/error-state-matcher.model';
import { RegisterComponent } from '../register/register.component';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { SessionService } from 'src/app/core/services/session/session.service';
import { User } from 'src/app/shared/models/user.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ForgotPassComponent } from '../forgot-pass/forgot-pass.component';
import { Router } from '@angular/router';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  //for error state matching
  matcher = new MyErrorStateMatcher();

  constructor(private dialog: MatDialog,
    private afs: AngularFirestore,
    private fb: FormBuilder,
    private authService: AuthService,
    private sessionService: SessionService,
    private spinner: NgxSpinnerService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  loginForm: FormGroup;
  ngOnInit(): void {
    this.spinner.show();

    //for login form validations
    this.loginForm = this.fb.group({
      username: this.fb.control("", [Validators.required]),
      password: this.fb.control("", [Validators.required])
    });

    this.spinner.hide();
  }

  //for closing of login form dialog via close button
  data = new ConfirmDialogModel();

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
        this.dialog.getDialogById('loginDialog').close();
      }
    });
  }

  //for realtime checking of username in DB
  public status;

  username($event) {
    this.status = "checking";
    const uname = $event.target.value.trim();

    this.afs.collection('users', ref => ref.where('username', '==', uname))
      .get().pipe(
        debounceTime(500),
        map(data => {
          this.status = "";
          !data.empty ? null : this.loginForm.get('username').setErrors({ notFound: true });
        })
      ).subscribe(data => {
      });
  }

  openRegister() {
    this.spinner.show();

    //to close login dialog
    this.dialog.getDialogById('loginDialog').close();
    //to open register dialog
    this.dialog.open(RegisterComponent, {
      disableClose: true,
      id: "registerDialog"
    });

    this.spinner.hide();
  };

  public passStatus = "";
  onSubmit() {
    this.spinner.show();

    //for pass status change for UI
    this.passStatus = "checking";
    const pass = this.loginForm.get('password').value.toString().trim();
    const uname = this.loginForm.get('username').value.toString().trim();

    this.authService.login(uname, pass).subscribe(data => {
      if (data.empty) {
        this.spinner.hide();

        //for invalid password

        //for sending error message to form
        this.loginForm.get('password').setErrors({ "invalid_password": true });
        //for pass status change for UI
        this.passStatus = "";

        //for login debugging with console log
        // this.authService.loginStatus.subscribe(data => { console.log(data) });
      } else {
        data.docs.map(user => {
          //for pass status change for UI
          this.passStatus = "";
          // console.log(user.data());

          if (user.data().status) {

            //for id
            const id = user.id;

            //to store data in session sevice variables
            this.sessionService.saveUser(user.data() as User);
            this.sessionService.setIsVerified("true");
            this.sessionService.setUserType("SUBSCRIBER");
            this.sessionService.setLoginState("true");
            this.sessionService.setAllPermissions();
            this.sessionService.setId(id);

            this.dialog.closeAll();

            this.spinner.hide();

            //for valid user if is verified by admin
            this.authService.currentLoginStatus.next("logged in");
            this.authService.isLoggedInSubject.next(true);

            //redirecting user after login to feed
            this.router.navigate(["./feed"]);



            if (this.router.navigated) {
              //to show sucess message of login on home page 
              this.snackBar.open('Login sucessful!!', 'Yahh! Okk ', {
                duration: 8000,
                horizontalPosition: 'end',
                verticalPosition: 'top',
                panelClass: ['notif-success']
              });
            }


          }
          else {
            //for valid user if is not verified by admin yet
            this.authService.currentLoginStatus.next("admin verification pending");
            this.authService.isLoggedInSubject.next(false);


            //to store data in session sevice variables
            this.sessionService.saveUser(user.data() as User);
            this.sessionService.setIsVerified("false");
            this.sessionService.setUserType("SUBSCRIBER");
            this.sessionService.setLoginState("false");
            this.sessionService.setAllPermissions();


            this.dialog.closeAll();

            this.spinner.hide();

            //to show alert message of pending request of login from admin
            this.snackBar.open('Your College does not verify your profile Yet', 'Okk!', {
              duration: 8000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
              panelClass: ['notif-alert']
            });
          }
        });

        //for login debugging with console log
        // this.authService.loginStatus.subscribe(data => { console.log(data) });
      }
    });
  };

  forgotPass() {
    this.spinner.show();

    this.dialog.getDialogById('loginDialog').close();
    this.dialog.open(ForgotPassComponent, {
      disableClose: false,
      id: "forgotPassDialog"
    });
    this.spinner.hide();
  }
}

