import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { SessionService } from 'src/app/core/services/session/session.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { MyErrorStateMatcher } from 'src/app/shared/models/error-state-matcher.model';
import { Event } from 'src/app/shared/models/event.model';
import { EventService } from '../../services/event/event.service';

@Component({
  selector: 'app-create-event-form',
  templateUrl: './create-event-form.component.html',
  styleUrls: ['./create-event-form.component.css']
})
export class CreateEventFormComponent implements OnInit {
  eventForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  event: Event;

  constructor(private dialog: MatDialog,
    private fb: FormBuilder,
    private session: SessionService,
    private spinner: NgxSpinnerService,
    private snackBar: MatSnackBar,
    private eventService: EventService) { }

  ngOnInit(): void {
    this.spinner.show();

    //to build form
    this.eventForm = this.fb.group({
      t: this.fb.control("", [Validators.required]),
      city: this.fb.control("", [Validators.required]),
      location: this.fb.control(""),
      description: this.fb.control("", [Validators.required]),
      host: this.fb.control("", [Validators.required]),
      duration: this.fb.control("", [Validators.required]),
      eventDate: this.fb.control("", [Validators.required]),
      eventTime: this.fb.control("", [Validators.required])
    });

    this.spinner.hide();
  }

  //data for confirm dialog
  data = new ConfirmDialogModel();
  //for closing experience form dialog via close button
  close() {
    this.data.title = "Are You sure you want to do this?";
    this.data.message = `This May lose your form data.`;
    this.dialog.open(ConfirmDialogComponent, {
      id: "confirmDialog",
      maxWidth: "500px",
      data: this.data,
      position: {
        top: '30px'
      }
    });

    this.dialog.getDialogById("confirmDialog").afterClosed().subscribe(returnedData => {
      if (returnedData) {
        this.dialog.getDialogById('eventFormDialog').close();
      }
    });
  }

  eventPhoto = null;
  @ViewChild('fileName') fileName;
  onPhotoSubmit($event) {
    let file: File = null;
    file = $event.target.files[0];

    this.fileName.nativeElement.value = file.name;

    let reader: FileReader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      this.eventPhoto = reader.result;
    }
  }

  onSubmit() {
    if (this.eventForm.valid) {
      this.spinner.show();

      this.event = this.eventForm.value;
      this.event.createdDate = new Date();
      this.event.attende = [];
      this.event.createdById = this.session.getId();
      this.event.verificationStatus = false;
      //to store event photo
      this.event.eventPhoto = this.eventPhoto;

      this.eventService.saveEvent(this.event);

      //to close the form dialog
      this.dialog.getDialogById('eventFormDialog').close();

      this.spinner.hide();

      this.snackBar.open('Event Verfication By Admin is pending!', 'Okk!! ', {
        duration: 8000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['notif-alert']
      });

    }
  }
}
