import { Component } from '@angular/core';
import { GeneralService } from 'src/app/servicios/general.service';
import { SqlService } from 'src/app/servicios/sql.service';
import { InicioComponent } from "../inicio/inicio.component";
import { EnvioDetallesComponent } from "../envio-detalles/envio-detalles.component";
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-envios',
  templateUrl: './envios.component.html',
  styleUrls: ['./envios.component.css'],
  template: `
  <button mat-button (click)="openDialog()">Open Dialog</button>
`,
})
export class EnviosComponent {
  tableData
  displayedColumns: string[] = ['id_cuenta', 'Etiqueta', 'Peso', 'Peso restante', 'Parcialidades', 'Parcialidades restantes','Enviar','Detalle'];

  constructor(
    private sqlService:SqlService,
    private gralService:GeneralService,
    private dialog: MatDialog
      ) { }


  ngOnInit() {
    this.traer_datos()
  }


  traer_datos(){
     this.sqlService.getData("cuenta_envio").subscribe(resp=>{
      this.tableData = resp
    })
  }



  openDialog(id) {
    const dialogRef = this.dialog.open(InicioComponent,{
      data: {info: id}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.traer_datos()
    });
  }

  ver_detalle(id){
    const dialogRef = this.dialog.open(EnvioDetallesComponent,{
      data: {info: id}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.traer_datos()
    });
  }
}
