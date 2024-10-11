import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-confirmacao',
  templateUrl: './dialog-confirmacao.component.html',
  styleUrls: ['./dialog-confirmacao.component.css']
})
export class DialogConfirmacaoComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogConfirmacaoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { nomeEquipamento: string }
  ) {}

  confirmar(): void {
    this.dialogRef.close(true);
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}
