import { Component, OnInit } from '@angular/core';


import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from 'src/app/modules/login/components/login/login.component';
import { RegisterComponent } from 'src/app/modules/login/components/register/register.component';

import { SessionService } from 'src/app/core/services/session/session.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  dialogRef;
  constructor(private dialog: MatDialog, private authService: AuthService,
    private sessionService: SessionService, private router: Router,
    private snackBar: MatSnackBar,
  ) { }

  //for current login state
  public currentLoginState: boolean;

  //for current user profile
  public id: string;

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe(data => {
      this.currentLoginState = data;
      //every time user status change update id
      this.id = this.sessionService.getId();

    });

    this.currentLoginState = this.sessionService.getLoginState() === "false" || this.sessionService.getLoginState() === null ? false : true;
  }

  openLogin() {
    this.dialogRef = this.dialog.open(LoginComponent, {
      disableClose: true,
      id: "loginDialog"
    });

  }

  openRegister() {
    this.dialogRef = this.dialog.open(RegisterComponent, {
      disableClose: true,
      id: "registerDialog"
    });

  }

  logout() {
    this.authService.isLoggedInSubject.next(false);
    this.sessionService.clearSessionData();
    this.currentLoginState = false;

    if (this.router.navigated) {
      //to show sucess message of login on home page 
      this.snackBar.open('Login sucessful!!', 'Yahh! Okk ', {
        duration: 8000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['notif-success']
      });
    }
    //for redirecting user to home page
    if (this.router.url != "/home") {
      this.router.navigate(["./home"]);

    }
  }
}
