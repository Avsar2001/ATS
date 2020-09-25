import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { FeedHomeComponent } from './components/feed-home/feed-home.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Feed'
    },
    children: [
      {
        path: 'feed',
        component: FeedHomeComponent,
        canActivate: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeedRoutingModule { }
