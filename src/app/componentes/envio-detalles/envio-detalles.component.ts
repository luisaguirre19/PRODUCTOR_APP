import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/servicios/auth.service';
import { SqlService } from 'src/app/servicios/sql.service';
import QRCode from 'qrcode';
import { VerImgComponent } from "../ver-img/ver-img.component";

@Component({
  selector: 'app-envio-detalles',
  templateUrl: './envio-detalles.component.html',
  styleUrls: ['./envio-detalles.component.css']
})
export class EnvioDetallesComponent {
  envios
  displayedColumns: string[] = ['id_envio', 'peso', 'estado', 'vehiculo', 'detalle'];
  id

  constructor(
    private sqlService:SqlService,
    private authService:AuthService,
    public dialogRef: MatDialogRef<EnvioDetallesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog

  ) { 
    this.id = data.info
    this.traer_datos(data.info)
  }

  ngOnInit() {
    this.traer_datos(this.id)

  }
  traer_datos(id){
    console.log("enviamos a preguntar " + id)
     this.sqlService.getData_envio('envios', 'id_generico', id).subscribe(resp=>{
      console.log(resp)
      this.envios = resp
    })
  }

  cerrar(){
    this.dialogRef.close();
  }

  generateQRCode(id,placa) {
    alert(this.id+placa+id)
    QRCode.toDataURL(this.id+placa+id, { errorCorrectionLevel: 'H' }, (err, url) => {
      if (err) {
        console.error(err);
      }
      this.openDialog(url);
    });
  }

  openDialog(url) {
    const dialogRef = this.dialog.open(VerImgComponent,{
      data: {info: url}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
     // this.traer_datos()
    });
  }
}
