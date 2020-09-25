import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NewsService } from '../../services/news/news.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.css']
})
export class NewsDetailComponent implements OnInit {

  constructor(private route: ActivatedRoute, private service: NewsService,
    private router: Router, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show();

    this.route.paramMap.subscribe(data => {
      this.id = data.get('id');
    });

    this.service.getNewsById(this.id.trim()).subscribe(data => {
      if (data.exists) {
        this.news = data.data();
        this.news.id = this.id;
        this.news.createdOn = this.news.createdOn.toDate();

        this.spinner.hide();
      }
      else {
        this.spinner.hide();
        this.router.navigate(['../home']);
        console.error("News Dosen't Exist.");
      }
    })

  }
  public news: any;
  public id: string;
}
