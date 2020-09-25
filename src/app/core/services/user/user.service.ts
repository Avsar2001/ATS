import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from 'src/app/shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private afs: AngularFirestore) { }

  updateUser(id: string, user: User) {
    return this.afs.collection('users').doc(id).set(user);
  }

  getAllUsers() {
    return this.afs.collection('users').get();
  }

  getUserById(id: string) {
    return this.afs.collection('users').doc(id).get();
  }
}
