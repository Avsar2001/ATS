import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {

  title: string;
  message: string;

  constructor(private dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private parentData: ConfirmDialogModel) { }

  ngOnInit(): void {
    this.title = this.parentData.title;
    this.message = this.parentData.message;
  }

  onDismiss() {
    this.dialogRef.close(false);
  }

  onConfirm() {
    this.dialogRef.close(true);
  }

}

// here is the confirm dialog model to show custom message with parent compo.
export class ConfirmDialogModel {
  title: string;
  message: string;
}