import { Injectable } from '@angular/core';
import { User } from 'src/app/shared/models/user.model';


@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor() { }

  private currentUser: User;
  private isLoggedIn: string;
  private isVerified: string;
  private userType: string;
  private read: boolean;
  private write: boolean;
  private update: boolean;
  private delete: boolean;
  private like: boolean;
  private comment: boolean;
  private id: string;

  //for id
  public setId(id: string) {
    this.id = id.trim();
    localStorage.setItem("id", this.id);
  }
  public getId() {
    return localStorage.getItem("id");
  }

  //for user type
  public setUserType(v: string) {
    this.userType = v.trim();
    localStorage.setItem("userType", this.userType);
  }
  public getUserType(): string {
    return localStorage.getItem("userType") || null;
  }

  //for all permissions
  public setAllPermissions() {
    if (this.userType === "GUEST") {
      this.read = true;
      this.update = false;
      this.delete = false;
      this.write = false;
      this.like = false;
      this.comment = false;
    }
    else if (this.userType === "SUBSCRIBER") {
      this.read = true;
      this.update = false;
      this.delete = false;
      this.write = false;
      this.like = true;
      this.comment = true;
    }
    else if (this.userType === "ADMIN") {
      this.read = true;
      this.update = true;
      this.delete = true;
      this.write = true;
      this.like = true;
      this.comment = true;
    }
    localStorage.setItem("read", JSON.stringify(this.read));
    localStorage.setItem("write", JSON.stringify(this.write));
    localStorage.setItem("update", JSON.stringify(this.update));
    localStorage.setItem("delete", JSON.stringify(this.delete));
    localStorage.setItem("like", JSON.stringify(this.like));
    localStorage.setItem("comment", JSON.stringify(this.comment));
  }

  //for user verifed
  public getIsVerified(): string {
    return localStorage.getItem("isUserVerified") || null;
  }
  public setIsVerified(v: string) {
    this.isVerified = v;
    localStorage.setItem("isUserVerified", this.isVerified);
  }

  //for login state
  public getLoginState(): string {
    return localStorage.getItem("isUserLoggedIn") || null;
  }
  public setLoginState(v: string) {
    this.isLoggedIn = v;
    localStorage.setItem("isUserLoggedIn", this.isLoggedIn);
  }

  //for user
  public saveUser(v: any) {
    this.currentUser = v;
    localStorage.setItem("currentUser", JSON.stringify(this.currentUser));
  }

  public getUser(): User {
    return JSON.parse(localStorage.getItem("currentUser"));
  }


  public clearSessionData() {
    localStorage.clear();
  }
}
