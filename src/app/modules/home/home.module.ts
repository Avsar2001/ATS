import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { HomeComponent } from './components/home/home.component';

import { HomeRoutingModule } from './home-routing.module';

import { SharedModule } from 'src/app/shared/shared.module';
import { NewsComponent } from './components/news/news.component';
import { NewsDetailComponent } from './components/news-detail/news-detail.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ExperienceFormComponent } from './components/user-profile/experience-form/experience-form.component';
import { EducationFormComponent } from './components/user-profile/education-form/education-form.component';
import { PersonalInfoFormComponent } from './components/user-profile/personal-info-form/personal-info-form.component';
import { ContactFormComponent } from './components/user-profile/contact-form/contact-form.component';
import { SkillsListFormComponent } from './components/user-profile/skills-list-form/skills-list-form.component';
import { DragulaModule } from 'ng2-dragula';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { SearchComponent } from './components/search/search.component';
import { SearchPipe } from './pipes/search.pipe';
import { OthersProfileComponent } from './components/others-profile/others-profile.component';





@NgModule({
  declarations: [HomeComponent, NewsComponent, NewsDetailComponent,
    UserProfileComponent, ExperienceFormComponent, EducationFormComponent, PersonalInfoFormComponent, ContactFormComponent, SkillsListFormComponent, SearchComponent, SearchPipe, OthersProfileComponent
  ],
  imports: [
    SharedModule,
    HomeRoutingModule,
    DragulaModule.forRoot()
  ],
  entryComponents: [
    ExperienceFormComponent,
    EducationFormComponent,
    ConfirmDialogComponent
  ]
})
export class HomeModule { }
