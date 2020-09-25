import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/core/services/user/user.service';
import { UserPostService } from 'src/app/modules/feed/service/user-post.service';
import { AcademicInfo, ExperienceInfo, User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-others-profile',
  templateUrl: './others-profile.component.html',
  styleUrls: ['./others-profile.component.css']
})
export class OthersProfileComponent implements OnInit {
  //for comment section
  @ViewChildren('expansion') expansionPanel: QueryList<MatExpansionPanel>;

  currentUser: User;
  userId;

  public profileImageUrl;
  public defaultProfileImageUrl = "./../../../../../assets/images/default-profile-picture1.jpg"
  public coverImageUrl;
  public defaultCoverImageUrl = "../../../../../assets/images/profile-bg.jpg"
  //list of experience and education and skills
  userExperienceList: ExperienceInfo[] = [];
  educationList: AcademicInfo[] = [];


  constructor(private spinner: NgxSpinnerService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.spinner.show();

    let userId;
    //to get userid from route
    this.route.paramMap.subscribe(data => {

      userId = data.get('id');
    })

    //to get current user info
    this.userService.getUserById(userId).subscribe(data => {
      this.currentUser = data.data() as User;

      if (this.currentUser.status == true) {
        //to save profile image
        this.profileImageUrl = this.currentUser.profileImage ? this.currentUser.profileImage : null;
        //to save cover image
        this.coverImageUrl = this.currentUser.coverImage ? this.currentUser.coverImage : null;

        //to insert list of experience into experience list
        this.userExperienceList = this.currentUser.experience;
        //to insert list of education into education list
        this.educationList = this.currentUser.academic;

        this.spinner.hide();
      }
      else {
        //to redirect user to search page
        this.router.navigate(["./home"]);

        //to get user message
        this.snackBar.open('User is not verified yet!', 'Okk!! ', {
          duration: 8000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['notif-warn']
        });
      }

    })
  }

  //utility funcation for get differance between 2 dates in month
  getDiffMonth(end: Date, start: Date) {
    const date1 = new Date(end);
    const date2 = new Date(start);
    return (date1.getFullYear() * 12 + date1.getMonth()) - (date2.getFullYear() * 12 + date2.getMonth());
  }

}
