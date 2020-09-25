import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-jobs-card',
  templateUrl: './jobs-card.component.html',
  styleUrls: ['./jobs-card.component.css']
})
export class JobsCardComponent implements OnInit {

  @Input("author")
  author: Observable<any>;

  @Input("id")
  id: string;

  @Input("isVerified")
  isVerified?: boolean;

  imageUrl = "https://img.icons8.com/bubbles/100/000000/user-female-circle.png";

  constructor(private router: Router) { }

  ngOnInit(): void {
    if (this.author) {
      this.author.subscribe(data => {
        this.imageUrl = data.profileImage;
      })
    }
  }

  showMore() {
    this.router.navigate(["../jobs/", this.id]);
  }
}
