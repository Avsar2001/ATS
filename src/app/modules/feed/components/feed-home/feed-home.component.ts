import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { SessionService } from 'src/app/core/services/session/session.service';
import { UserService } from 'src/app/core/services/user/user.service';
import { Comment, UserPost } from 'src/app/shared/models/user-post.model';
import { UserPostService } from '../../service/user-post.service';
import { MatExpansionPanel } from '@angular/material/expansion';
import { NewsService } from 'src/app/modules/home/services/news/news.service';
import { EventService } from 'src/app/modules/event/services/event/event.service';


@Component({
  selector: 'app-feed-home',
  templateUrl: './feed-home.component.html',
  styleUrls: ['./feed-home.component.css']
})
export class FeedHomeComponent implements OnInit {
  //for current hour and minute at the time of page intialize
  public currentHour: number;
  public currentMinute: number;
  public currentDay: number;

  @ViewChildren('expansion') expansionPanel: QueryList<MatExpansionPanel>;

  postContentForm: FormGroup;
  commentForm: FormGroup;

  public feed: Observable<any>;
  public news: Observable<any>;
  public events: Observable<any>;

  constructor(private userPostService: UserPostService,
    public sessionService: SessionService,
    private spinner: NgxSpinnerService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private userService: UserService,
    private newsService: NewsService,
    private eventService: EventService) { }

  ngOnInit(): void {
    this.spinner.show();

    //to get current hour and minute
    this.currentHour = new Date().getHours();
    this.currentMinute = new Date().getMinutes();


    //to create form
    this.postContentForm = this.fb.group({
      postContent: this.fb.control("", Validators.required)
    })

    //to create comment field
    this.commentForm = this.fb.group({
      commentField: this.fb.control("", Validators.required)
    });

    //to get all posts
    this.feed = this.userPostService.getAllPosts().pipe(
      map(actions => {
        return actions.docs.map(a => {
          //Get document data
          let data = a.data() as UserPost;

          const postAuthor = this.getUserByUserId(data.authorId);
          //Get document id
          let id = a.id;

          //to get like
          let firstThreeUserliked = [];
          for (let i = 0; i < 3; i = i + 1) {
            if (data.like.length > i) {
              this.getUserByUserId(data.like[i].trim()).subscribe(data => {
                data.map(user => {
                  firstThreeUserliked.push(user);
                })
              })
            }
          }

          //to get all comments
          const comments$ = this.userPostService.getAllCommentsByPostId(id).pipe(
            map(data => {
              return data.docs.map(comment => {
                let commentData = comment.data() as Comment;
                let commentAuthor$ = this.getUserByUserId(commentData.authorId);

                return { ...commentData, commentAuthor$ };

              })
            })
          )
          this.spinner.hide();
          //Use spread operator to add the id to the document data
          return { id, ...data, postAuthor, comments$, firstThreeUserliked };

        })
      })
    );

    //to get news
    this.news = this.newsService.getNews().pipe(
      map(data => {
        return data.docs.map(news => {
          let newsData = news.data();
          newsData.createdOn = newsData.createdOn.toDate();
          return newsData;
        })
      })
    );

    //to get events
    this.events = this.eventService.getEvents().pipe(
      map(data => {
        return data.docs.map(events => {
          let eventData = events.data();
          return eventData;
        })
      })
    )


  }

  //to add photo into the post
  public postPhotoUrl;

  onPostPhotoSelected($event) {
    let file: File = null;
    file = $event.target.files[0];

    let reader: FileReader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      this.postPhotoUrl = reader.result;
    }

  }

  post: UserPost;


  addPost() {
    this.spinner.show();

    if (this.postContentForm.get("postContent").valid) {

      //for creating a post..
      this.post = {
        authorId: this.sessionService.getId(),
        createdDate: new Date(),
        createdTime: {
          hours: new Date().getHours(),
          minutes: new Date().getMinutes()
        },
        like: [],
        share: 0,
        content: this.postContentForm.get("postContent").value,
        postPhoto: this.postPhotoUrl ? this.postPhotoUrl : null
      }

      //to reset form
      this.postContentForm.reset();
      this.postPhotoUrl = null;

      this.userPostService.addPost(this.post).finally(() => {
        this.spinner.hide();
      })

      //to show snackbar
      this.snackBar.open('Your Post Been Uploaded Successfully! please Refresh!', 'Thanks!! ', {
        duration: 8000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['notif-success']
      });
    }

    this.spinner.hide();

  }

  getUserByUserId(id: string) {
    //to get author name
    return this.userService.getUserById(id).pipe(
      map(user => {
        let data = user.data();
        return [data];
      })
    )
  }

  giveLike(postId: string) {
    let currentPost: UserPost;
    this.userPostService.getPostById(postId).subscribe(data => {
      currentPost = { ...data.data() as UserPost };
    },
      err => {
        console.error(err);
      },
      () => {
        let index: number = currentPost.like.indexOf(this.sessionService.getId());
        if (index == -1) {
          currentPost.like.push(this.sessionService.getId());
        }
        else {
          currentPost.like.splice(index, 1);
        }

        this.userPostService.updatePost(currentPost, postId);

      })

  }

  openComment(index: number) {
    let expansionArray: MatExpansionPanel[] = this.expansionPanel.toArray();

    let currentExpansionPanel = expansionArray[index];

    currentExpansionPanel.toggle();

  }


  addComment(postId: string, comments$: Observable<any>) {
    if (this.commentForm.valid) {
      let commentString = this.commentForm.get("commentField").value;
      let comment = {
        comment: commentString,
        commentDate: new Date(),
        commentTime: {
          hours: new Date().getHours(),
          minutes: new Date().getMinutes()
        },
        authorId: this.sessionService.getId()
      }
      //to save this comment into db
      this.userPostService.addComment(comment, postId.trim());


      //to reset the comment box
      this.commentForm.reset();

      //to get instance update in the 
      let newComments = [];

      let currentUserName: string = this.sessionService.getUser().personal.firstName + " " + this.sessionService.getUser().personal.lastName;
      newComments.push({ ...comment, commentAuthorName: of(currentUserName) });

      comments$.subscribe(data => {
        data.map(d => {
          newComments.push(d);
          console.log(d);
        })
      })

      let obs = of(newComments);

      return obs;
    }
  }
}
