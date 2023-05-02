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
      "peso":this.peso,
      "id_generico":this.id
    })
    .subscribe(data=>{
      if(data[0].resp == 'Si'){
        alert("Envio realizado correctamente")
      }else{
        alert("Envio fallo, revisa los datos ingresados")
      }
      this.dialogRef.close();
    })
  }

  ngOnInit() {
    this.traer_datos()

  }
  traer_datos(){
     this.sqlService.getData("transporte").subscribe(resp=>{
      this.placas = resp
    })
  }
}
