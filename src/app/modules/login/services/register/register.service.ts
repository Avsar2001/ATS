import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from 'src/app/shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private afs: AngularFirestore) { }

  saveUser(user: User){
    return this.afs.collection('users').add({...user});
  }
}
