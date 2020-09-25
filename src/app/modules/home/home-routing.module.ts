import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NewsComponent } from './components/news/news.component';
import { NewsDetailComponent } from './components/news-detail/news-detail.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { SearchComponent } from './components/search/search.component';
import { CustomHomeRedirectGuard } from 'src/app/core/guards/custom-home-redirect.guard';
import { OthersProfileComponent } from './components/others-profile/others-profile.component';






const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Home'
    },
    children: [

      {
        path: 'home',
        component: HomeComponent,
        canActivate: [CustomHomeRedirectGuard]
      },
      {
        path: 'news',
        component: NewsComponent
      },
      {
        path: 'news/:id',
        component: NewsDetailComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'user/:username',
        component: UserProfileComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'search',
        component: SearchComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'users/:id',
        component: OthersProfileComponent,
        canActivate: [AuthGuard]
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
