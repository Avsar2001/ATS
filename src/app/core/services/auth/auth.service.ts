import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { SessionService } from '../session/session.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afs: AngularFirestore, private sessionService: SessionService) { }

  //only for checking login status at form submission time and pass data to snackbar!
  public currentLoginStatus = new BehaviorSubject("false");

  //for login state of user

  public isLoggedInSubject = new BehaviorSubject(this.sessionService.getLoginState() === "true");
  public isLoggedIn = this.isLoggedInSubject.asObservable();


  login(username: string, password: string) {
    return this.afs.collection('users', ref => ref.where('password', '==', password.trim()).where('username', '==', username.trim())).get();
  }
}
