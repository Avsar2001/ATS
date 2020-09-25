import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Job } from 'src/app/shared/models/job.model';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor(private service: AngularFirestore) { }

  getAllJobs() {
    return this.service.collection('jobs').get();
  }

  getJobById(id: string) {
    return this.service.collection('jobs/').doc(id).get();
  }

  saveJob(job: Job) {
    return this.service.collection('jobs').add(job);
  }

  getJobByUserId(id: string) {
    return this.service.collection('jobs', fn => fn.where('authorId', "==", id)).get();
  }

}
