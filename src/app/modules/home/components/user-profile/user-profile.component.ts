import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ExperienceFormComponent } from './experience-form/experience-form.component';
import { EducationFormComponent } from './education-form/education-form.component';
import { ExperienceInfo, User, AcademicInfo } from 'src/app/shared/models/user.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { SessionService } from 'src/app/core/services/session/session.service';
import { PersonalInfoFormComponent } from './personal-info-form/personal-info-form.component';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { SkillsListFormComponent } from './skills-list-form/skills-list-form.component';
import { ConfirmDialogModel, ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { UserService } from 'src/app/core/services/user/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AsyncSubject, Observable, of } from 'rxjs';
import { UserPostService } from 'src/app/modules/feed/service/user-post.service';
import { Comment, UserPost } from 'src/app/shared/models/user-post.model';
import { map, take } from 'rxjs/operators';
import { MatExpansionPanel } from '@angular/material/expansion';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  //for comment section
  @ViewChildren('expansion') expansionPanel: QueryList<MatExpansionPanel>;

  currentUser: User;
  userId;

  commentForm: FormGroup;

  //for feed
  public feed: Observable<any>;

  constructor(private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private session: SessionService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private userPostService: UserPostService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.spinner.show();

    //to get current user info
    this.currentUser = this.session.getUser();
    //to save profile image
    this.profileImageUrl = this.currentUser.profileImage ? this.currentUser.profileImage : null;
    //to save cover image
    this.coverImageUrl = this.currentUser.coverImage ? this.currentUser.coverImage : null;

    this.userId = this.session.getId();
    //to insert list of experience into experience list
    this.userExperienceList = this.currentUser.experience;
    //to insert list of education into education list
    this.educationList = this.currentUser.academic;

    //to create comment field
    this.commentForm = this.fb.group({
      commentField: this.fb.control("", Validators.minLength(1))
    });

    //to get all posts
    this.feed = this.userPostService.getAllPostsByUserId(this.userId).pipe(
      map(actions => {
        return actions.docs.map(a => {
          //Get document data
          let data = a.data() as UserPost;

          const authorName = this.currentUser.personal.firstName + " " + this.currentUser.personal.lastName;
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
          // console.log(comments$);
          this.spinner.hide();
          //Use spread operator to add the id to the document data
          return { id, ...data, authorName, comments$, firstThreeUserliked };

        })
      })
    );

    // this.getUserObjByUserId("zeuZvXP2zZTIuGmP0vPN");

    this.spinner.hide();
  }

  //to get user full name for comments
  getUserByUserId(id: string) {
    //to get author name
    return this.userService.getUserById(id).pipe(
      map(user => {
        let data = user.data();
        // return data.personal.firstName + " " + data.personal.lastName;
        return [data];
      })
    )
  }

  //for posts start

  giveLike(postId: string) {
    let currentPost: UserPost;
    this.userPostService.getPostById(postId).subscribe(data => {
      currentPost = { ...data.data() as UserPost };
    },
      err => {
        console.error(err);
      },
      () => {
        let index: number = currentPost.like.indexOf(this.userId);
        if (index == -1) {
          currentPost.like.push(this.userId);
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
        authorId: this.userId
      }
      //to save this comment into db
      this.userPostService.addComment(comment, postId.trim());


      //to reset the comment box
      this.commentForm.reset();

      //to get instance update in the 
      let newComments = [];

      let currentUserName: string = this.currentUser.personal.firstName + " " + this.currentUser.personal.lastName;
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

  //for posts end

  //list of experience and education and skills
  userExperienceList: ExperienceInfo[] = [];
  educationList: AcademicInfo[] = [];

  //for adding experience info
  experienceDialogRef;
  openAddExperience() {
    this.experienceDialogRef = this.dialog.open(ExperienceFormComponent, {
      disableClose: true,
      id: "experienceFormDialog",
      maxWidth: "600px",
      data: {
        user: this.currentUser,
        isCallForEdit: false
      }
    });
  }

  //for adding experience info
  educationDialogRef;
  openAddEducation() {
    this.educationDialogRef = this.dialog.open(EducationFormComponent, {
      disableClose: true,
      id: "educationFormDialog",
      maxWidth: "600px",
      data: {
        user: this.currentUser,
        isCallForEdit: false
      }
    });
  }

  //for editing perticular experience
  openEditExperience(index, $event) {
    $event.stopPropagation();
    this.experienceDialogRef = this.dialog.open(ExperienceFormComponent, {
      disableClose: true,
      id: "experienceFormDialog",
      maxWidth: "600px",
      data: {
        user: this.currentUser,
        isCallForEdit: true,
        index: index
      }
    });
  }

  //for editing perticular education
  openEditEducation(index, $event) {
    $event.stopPropagation();
    this.educationDialogRef = this.dialog.open(EducationFormComponent, {
      disableClose: true,
      id: "educationFormDialog",
      maxWidth: "600px",
      data: {
        user: this.currentUser,
        isCallForEdit: true,
        index: index
      }
    });
  }

  //for edit personal info
  personalDialogRef;
  openEditPersonal() {
    this.personalDialogRef = this.dialog.open(PersonalInfoFormComponent, {
      disableClose: true,
      id: "personalFormDialog",
      maxWidth: "600px",
      data: {
        user: this.currentUser
      }
    });
  }

  //for edit contact info
  contactDialogRef;
  openEditContact() {
    this.contactDialogRef = this.dialog.open(ContactFormComponent, {
      disableClose: true,
      id: "contactFormDialog",
      maxWidth: "600px",
      data: {
        user: this.currentUser
      }
    });
  }

  //for editing skills
  skillsDialogRef;
  openEditSkills() {
    this.skillsDialogRef = this.dialog.open(SkillsListFormComponent, {
      disableClose: true,
      id: "skillsFormDialog",
      width: "600px",
      data: {
        user: this.currentUser
      }
    });
  }

  //data for confirm dialog
  data = new ConfirmDialogModel();
  //to remove experience
  removeExperience(index: number, $event) {
    $event.stopPropagation();

    this.data.title = "Are You sure you want to delete this?";
    this.data.message = `This May lose your Experience data.`;
    this.dialog.open(ConfirmDialogComponent, {
      id: "confirmDialog",
      maxWidth: "500px",
      data: this.data,
      position: {
        top: '30px'
      }
    });

    this.dialog.getDialogById("confirmDialog").afterClosed().subscribe(returnedData => {
      if (returnedData) {
        this.spinner.show();

        this.userExperienceList.splice(index, 1);

        this.currentUser.experience = this.userExperienceList;

        // to add this new user detail into session storage
        this.session.saveUser(this.currentUser);

        //to save user into firestore
        const id = this.session.getId();
        this.userService.updateUser(id, this.currentUser);

        this.spinner.hide();

        //to show sucess message of login on home page 
        this.snackBar.open('Your Experience Deleted Successfully', 'Thanks!! ', {
          duration: 8000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['notif-success']
        });
      }
    });
  }

  removeEducation(index: number, $event) {
    $event.stopPropagation();

    this.data.title = "Are You sure you want to delete this?";
    this.data.message = `This May lose your Education data.`;
    this.dialog.open(ConfirmDialogComponent, {
      id: "confirmDialog",
      maxWidth: "500px",
      data: this.data,
      position: {
        top: '30px'
      }
    });

    this.dialog.getDialogById("confirmDialog").afterClosed().subscribe(returnedData => {
      if (returnedData) {
        this.spinner.show();

        this.educationList.splice(index, 1);

        this.currentUser.academic = this.educationList;

        // to add this new user detail into session storage
        this.session.saveUser(this.currentUser);

        //to save user into firestore
        const id = this.session.getId();
        this.userService.updateUser(id, this.currentUser);

        this.spinner.hide();

        //to show sucess message of login on home page 
        this.snackBar.open('Your Education Deleted Successfully', 'Thanks!! ', {
          duration: 8000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['notif-success']
        });
      }
    });
  }

  //utility funcation for get differance between 2 dates in month
  getDiffMonth(end: Date, start: Date) {
    const date1 = new Date(end);
    const date2 = new Date(start);
    return (date1.getFullYear() * 12 + date1.getMonth()) - (date2.getFullYear() * 12 + date2.getMonth());
  }

  public profileImageUrl;
  public defaultProfileImageUrl = "./../../../../../assets/images/default-profile-picture1.jpg"
  //for profile pic
  onProfilePicSelected($event) {
    let file: File = null;
    file = $event.target.files[0];

    let reader: FileReader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      this.profileImageUrl = reader.result;

      //to confirm pic change
      this.data.title = "Are You sure you want to update profile picture?";
      this.data.message = `This May lose your previous picture.`;
      this.dialog.open(ConfirmDialogComponent, {
        id: "confirmDialog",
        maxWidth: "500px",
        data: this.data,
        position: {
          top: '30px'
        }
      });

      //after confirming
      this.dialog.getDialogById("confirmDialog").afterClosed().subscribe(returnedData => {
        if (returnedData) {
          this.spinner.show();

          this.currentUser.profileImage = this.profileImageUrl;
          // to add this new user detail into session storage
          this.session.saveUser(this.currentUser);

          //to save user into firestore
          const id = this.session.getId();
          this.userService.updateUser(id, this.currentUser);

          this.spinner.hide();

          //to show sucess message of login on home page 
          this.snackBar.open('Your Profile Picture Updated Successfully', 'Thanks!! ', {
            duration: 8000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['notif-success']
          });
        }
        else {
          //to show sucess message of login on home page 
          this.snackBar.open('Please Refresh Page for get your old profile picture!', 'Okk!! ', {
            duration: 8000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['notif-alert']
          });
        }
      })

    }

  }

  public coverImageUrl;
  public defaultCoverImageUrl = "../../../../../assets/images/profile-bg.jpg"
  //for profile pic
  onCoverPicSelected($event) {
    let file: File = null;
    file = $event.target.files[0];

    let reader: FileReader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      this.coverImageUrl = reader.result;

      //to confirm pic change
      this.data.title = "Are You sure you want to update Cover picture?";
      this.data.message = `This May lose your previous picture.`;
      this.dialog.open(ConfirmDialogComponent, {
        id: "confirmDialog",
        maxWidth: "500px",
        data: this.data,
        position: {
          top: '30px'
        }
      });

      //after confirming
      this.dialog.getDialogById("confirmDialog").afterClosed().subscribe(returnedData => {
        if (returnedData) {
          this.spinner.show();

          this.currentUser.coverImage = this.coverImageUrl;
          // to add this new user detail into session storage
          this.session.saveUser(this.currentUser);

          //to save user into firestore
          const id = this.session.getId();
          this.userService.updateUser(id, this.currentUser);

          this.spinner.hide();

          //to show sucess message of login on home page 
          this.snackBar.open('Your Cover Picture Updated Successfully', 'Thanks!! ', {
            duration: 8000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['notif-success']
          });
        }
        else {
          //to show sucess message of login on home page 
          this.snackBar.open('Please Refresh Page for get your old Cover picture!', 'Okk!! ', {
            duration: 8000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['notif-alert']
          });
        }
      })

    }

  }
}
