import { Component } from '@angular/core';
import { NgwWowService } from 'ngx-wow';






@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private wowService: NgwWowService) {
    this.wowService.init();

    //for debugging of spinner use this
    // this.spinner.show();
  }

  ngOnInit() {

  }
}
