import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionService } from '../services/session/session.service';

@Injectable({
  providedIn: 'root'
})
export class CustomHomeRedirectGuard implements CanActivate {
  constructor(private sessionService: SessionService,
    private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.isLoggedIn()) {
      this.router.navigate(['./feed']);
      return false;
    }
    else {
      return true;
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
