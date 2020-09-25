import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import { Event } from 'src/app/shared/models/event.model';




@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private service: AngularFirestore) { }

  getAllEvents() {
    return this.service.collection('events').get();
  }

  getEvent(id: string) {
    // console.log(id);
    return this.service.collection('events').doc(id).get();
  }

  saveEvent(event: Event) {
    return this.service.collection('events').add(event);
  }

  getEventByUserId(id: string) {
    return this.service.collection('events', fn => fn.where('createdById', "==", id)).get();
  }

  getEvents() {
    return this.service.collection('events').get();
  }

  updateEvent(eventId: string, event: Event) {
    this.service.collection('events').doc(eventId).set(event);
  }
}
