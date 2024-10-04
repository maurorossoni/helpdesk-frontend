import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-result',
  templateUrl: './dialog-result.component.html',
  styleUrls: ['./dialog-result.component.css']
})
export class DialogResultComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogResultComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { consumoTotal: number, custoTotal: number, valorKwh: number }
  ) {}

  onClose(): void {
    this.dialogRef.close(); // Fecha o diálogo
  }
}
