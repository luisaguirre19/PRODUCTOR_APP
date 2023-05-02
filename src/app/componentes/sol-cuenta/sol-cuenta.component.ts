import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/servicios/auth.service';
import { SqlService } from 'src/app/servicios/sql.service';

@Component({
  selector: 'app-sol-cuenta',
  templateUrl: './sol-cuenta.component.html',
  styleUrls: ['./sol-cuenta.component.css']
})
export class SolCuentaComponent {
  name: string;
  age: number;
  peso:number
  parcialidad:number
  etiqueta

  tableData
  displayedColumns: string[] = ['id_cuenta', 'Etiqueta', 'Peso', 'Parcialidades', 'Estado'];
  constructor(
    private sqlService:SqlService,
    private authService:AuthService
  ) { }

  ngOnInit() {
    this.traer_datos()
  }

  submit(){
      this.sqlService.postData("cuenta",{
        "etiqueta":this.etiqueta,
        "peso":this.peso,
        "parcialidades":this.parcialidad,
        "correo":this.authService.correo_usuario
     })
     .subscribe(data=>{
        // this.sqlService.postData_beneficio("cuenta",{
        //     "etiqueta":this.etiqueta,
        //     "peso":this.peso,
        //     "parcialidades":this.parcialidad,
        //     "correo":this.authService.correo_usuario,
        //     "id_solicitud_prod":data[0].resp
        // })
        // .subscribe(data=>{
          this.traer_datos()
        //})
     })
  }

  traer_datos(){
    this.sqlService.getData("cuenta").subscribe(resp=>{
     this.tableData = resp
   })
 }
}
