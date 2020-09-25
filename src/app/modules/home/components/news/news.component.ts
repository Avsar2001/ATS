import { Component, OnInit } from '@angular/core';
import { News } from 'src/app/shared/models/news.model';
import { NewsService } from '../../services/news/news.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  constructor(private newsService: NewsService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show();

    this.newsService.getAllNews().subscribe(news => {
      news.docs.map(n => {
        this.currentNews = n.data();
        this.currentNews.id = n.id;
        this.currentNews.createdOn = this.currentNews.createdOn.toDate();
        this.news.push(this.currentNews);
        // console.log(this.currentNews);

        //to add tags of current news into tags array
        for (let element of this.currentNews.tags) {
          if (this.tags.indexOf(element.toLowerCase()) == -1) {
            this.tags.push(element.toLowerCase());
          }
        }

        this.spinner.hide();
      })
    });
    this.tempNews = this.news;
  }

  public news: News[] = [];
  public tempNews: News[];
  public currentNews: any;
  public tags: string[] = [];

  filter(tags) {
    this.spinner.show();

    this.news = [];

    if (tags.length == 0) {
      this.news = this.tempNews;
      this.spinner.hide();
      return;
    }

    this.news = this.tempNews.filter(news => {
      for (let tag of tags) {
        if (news.tags.indexOf(tag.value) == -1) {
          return false;
        }
      }
      return true;
    });

    this.spinner.hide();
  }

}
