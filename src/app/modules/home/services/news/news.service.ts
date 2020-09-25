import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(private service: AngularFirestore) { }

  getAllNews() {
    return this.service.collection('news').get();
  }

  getNewsById(id: string) {
    return this.service.collection('news/').doc(id).get();
  }

  getNews() {
    return this.service.collection('news').get();
  }

}
