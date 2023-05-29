import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/servicios/auth.service';
import { SqlService } from 'src/app/servicios/sql.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {
  selectedPlaca
  peso
  id
  placas

  conductor
  selectedConductor
  constructor(
    private sqlService:SqlService,
    private authService:AuthService,
    public dialogRef: MatDialogRef<InicioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    this.id = data.info
  }

  submit(){
    this.sqlService.postData("cuenta_envio",{
      "correo":this.authService.correo_usuario,
      "placa":this.selectedPlaca,
      "conductor":this.selectedConductor,
      "peso":this.peso,
      "id_generico":this.id
    })
    .subscribe(data=>{
      if(data[0].resp == 'Si'){
        console.log["esto va " + data[0].codigo_qr]
        this.envio_beneficio(data[0])
      }else if (data[0].resp == 'No conductor'){
        alert("Envio fallo, tu conductor no esta disponible")
      }else{
        alert("Envio fallo, revisa los datos ingresados")
      }
      this.dialogRef.close();
    })
  }

  envio_beneficio(resp){
    this.sqlService.postData_beneficio("cuenta_envio",{
      "id_envio":resp.id_envio,
      "id_cuenta":resp.id_cuenta,
      "peso":resp.peso,
      "estado":resp.estado,
      "vehiculo":resp.vehiculo,
      "codigo_qr":resp.codigo_qr
    })
    .subscribe(data=>{
      if(data[0].resp == 'Si'){
        alert("Envio realizado correctamente")
      }else{
        alert("Envio fallo, revisa los datos ingresados")
      }
    })
  }

  ngOnInit() {
    this.traer_datos_transporte()

  }
  traer_datos_transporte(){
     this.sqlService.postData("get_transporte", {"correo":this.authService.correo_usuario}).subscribe(resp=>{
      this.placas = resp
      this.traer_datos_conductor()
    })
  }

  traer_datos_conductor(){
    this.sqlService.postData("get_conductor", {"correo":this.authService.correo_usuario}).subscribe(resp=>{
      this.conductor = resp
    })
 }
}
