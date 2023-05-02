import { Component } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { SqlService } from 'src/app/servicios/sql.service';

@Component({
  selector: 'app-productores',
  templateUrl: './productores.component.html',
  styleUrls: ['./productores.component.css']
})
export class ProductoresComponent {
  constructor(
    private sqlService:SqlService,
    private authService:AuthService
  ) { }
  tableData
  displayedColumns: string[] = ['Marca', 'Color', 'Placa', 'eliminar'];
  Marca
  Color
  Placa
  ngOnInit() {
    this.traer_datos()

  }


  traer_datos(){
    this.Marca = ""
    this.Color = ""
    this.Placa = ""
     this.sqlService.getData("transporte").subscribe(resp=>{
      this.tableData = resp
    })
  }

  desactivar_cuenta(id:number){
    this.sqlService.putData("count","id_usuario",id,"estado","R").subscribe((resp)=>{
      this.traer_datos()
    })
  }

  submit(){
      this.sqlService.postData("transporte",{
       "correo":this.authService.correo_usuario,
       "marca":this.Marca,
       "color":this.Color,
       "placa":this.Placa
     })
     .subscribe(data=>{
       this.traer_datos()
     })
  }

  eliminar_vehiculo(id){
      this.sqlService.deleteData("transporte", "id_transporte",id)
      .subscribe(data=>{
        this.traer_datos()
      })
  }

}
