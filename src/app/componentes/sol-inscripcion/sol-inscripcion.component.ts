import { Component} from '@angular/core';
import { GeneralService } from 'src/app/servicios/general.service';
import { SqlService } from 'src/app/servicios/sql.service';

@Component({
  selector: 'app-sol-inscripcion',
  templateUrl: './sol-inscripcion.component.html',
  styleUrls: ['./sol-inscripcion.component.css']
})



export class SolInscripcionComponent {

  constructor(
    private sqlService:SqlService,
    private gralService:GeneralService
      ) { }
  tableData
  displayedColumns: string[] = ['id_login', 'correo', 'productor', 'nombres', 'apellidos', 'telefono','fecha_ingreso', 'actions'];

 
  ngOnInit() {
    this.traer_datos()
  }


  traer_datos(){
     this.sqlService.getData("count").subscribe(resp=>{
      this.tableData = resp
    })
  }

  activar_cuenta(id:number){
   
    this.sqlService.putData("count","id_usuario",id,"estado","A").subscribe((resp)=>{
      console.log("regreso " + resp)
      this.traer_datos()
    })
  }
  
  desactivar_cuenta(id:number){
    this.sqlService.putData("count","id_usuario",id,"estado","R").subscribe((resp)=>{
      console.log("regreso " + resp)
      this.traer_datos()
    })
  }

}


