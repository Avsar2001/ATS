import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultLayoutComponent } from './home-layout/default-layout/default-layout.component';


export const routes: Routes = [

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },

  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: '',
        loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)
      },
      {
        path: '',
        loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule)
      },
      {
        path: '',
        loadChildren: () => import('./modules/job/job.module').then(m => m.JobModule)
      },
      {
        path: '',
        loadChildren: () => import('./modules/event/event.module').then(m => m.EventModule)
      },
      {
        path: '',
        loadChildren: () => import('./modules/feed/feed.module').then(m => m.FeedModule)
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false, scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
