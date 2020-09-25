import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Comment, UserPost } from 'src/app/shared/models/user-post.model';

@Injectable({
  providedIn: 'root'
})
export class UserPostService {

  constructor(private af: AngularFirestore) { }

  addPost(post: UserPost) {
    return this.af.collection('post').add(post);
  }

  addComment(comment: Comment, postId: string) {
    return this.af.collection('post').doc(postId).collection('comments').add(comment);
  }

  getAllCommentsByPostId(id: string) {
    return this.af.collection('post').doc(id).collection('comments').get();
  }

  getAllPosts() {
    return this.af.collection('post').get();
  }

  getPostById(id: string) {
    return this.af.collection('post').doc(id).get();
  }

  updatePost(post: UserPost, id: string) {
    this.af.collection('post').doc(id).set(post);
  }

  getAllPostsByUserId(id: string) {
    return this.af.collection('post', fn => fn.where("authorId", "==", id)).get();
  }
}
