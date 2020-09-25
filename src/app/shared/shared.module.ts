import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { FlexLayoutModule } from '@angular/flex-layout';
import { JobsCardComponent } from './components/jobs-card/jobs-card.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DateAgoPipe } from './pipes/date-ago.pipe';

@NgModule({
  declarations: [JobsCardComponent, ConfirmDialogComponent, DateAgoPipe],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatGridListModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    CarouselModule, NgbModule, MatButtonModule, MatTabsModule, MatMenuModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    MatStepperModule,
    MatChipsModule,
    RouterModule,
    //for forms...
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  exports: [
    CommonModule,
    JobsCardComponent,
    MatGridListModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    CarouselModule, NgbModule, MatButtonModule, MatTabsModule, MatMenuModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatStepperModule,
    MatChipsModule,
    RouterModule,
    //for forms...
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DateAgoPipe
  ],
  entryComponents: [
    ConfirmDialogComponent
  ]
})
export class SharedModule {

}
