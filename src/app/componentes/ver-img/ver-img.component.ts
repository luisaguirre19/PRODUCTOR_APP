import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-ver-img',
  templateUrl: './ver-img.component.html',
  styleUrls: ['./ver-img.component.css']
})
export class VerImgComponent {
  generatedQRCode
  @ViewChild('qrCode', {static: false}) qrCode: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<VerImgComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { 
    this.generatedQRCode = data.info
  }

  imprimirImagen() {
    // Crea una nueva ventana con la imagen
    const ventana = window.open('', '', 'width=2600,height=2400');
    ventana.document.write(`<img src="${this.generatedQRCode}">`);
    ventana.document.close();
    
    // Imprime la ventana
    ventana.print();
  }
  
}
