import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionService } from '../services/session/session.service';
import { LoginComponent } from 'src/app/modules/login/components/login/login.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private sessionService: SessionService,
    private router: Router,
    private dialog: MatDialog) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.isLoggedIn()) {

      return true;
    }
    else {
      this.router.navigate(['./home']);
      this.dialog.open(LoginComponent, {
        disableClose: true,
        id: "loginDialog"
      });
      return false;
    }
  }

  isLoggedIn() {
    if (this.sessionService.getLoginState() === "true" && this.sessionService.getIsVerified() === "true") {
      return true;
    }
    else {
      return false;
    }
  }
}
