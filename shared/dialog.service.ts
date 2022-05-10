import { Injectable } from '@angular/core';
import {MatDialog} from '@angular/material'
import { MatConfirmDialogComponent } from 'src/app/mat-confirm-dialog/mat-confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }
openConfirmDialog(msg)
{
  return this.dialog.open(MatConfirmDialogComponent,{
    width:'390px',
    panelClass:'confirm-dialog-container',
    data:{
      message:msg
    }
  });
}

}
