import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeedRoutingModule } from './feed-routing.module';
import { FeedHomeComponent } from './components/feed-home/feed-home.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [FeedHomeComponent],
  imports: [
    CommonModule,
    FeedRoutingModule,
    SharedModule
  ]
})
export class FeedModule { }
