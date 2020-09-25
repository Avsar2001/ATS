
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { UserService } from 'src/app/core/services/user/user.service';
import { User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  usersList: User[] = [];
  usernameSubject = new Subject<string>();
  username;

  currentUser: any;
  constructor(private userService: UserService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show();

    this.userService.getAllUsers().subscribe(data => {
      data.docs.map(users => {
        this.currentUser = users.data();
        if (this.currentUser.status == true) {
          this.currentUser.id = users.id;
          this.usersList.push(this.currentUser);

          this.spinner.hide();
        }
      })
    })

  }

  filterUsers($event) {
    this.usernameSubject.next($event.target.value);

    this.usernameSubject.pipe(

      debounceTime(400),
      tap(data => this.spinner.show()),
      debounceTime(150),
      distinctUntilChanged()
    ).subscribe(data => {
      this.username = data;
      this.spinner.hide();
    });
  }

}
