import { Component } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { SqlService } from 'src/app/servicios/sql.service';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';

@Component({
  selector: 'app-conductor',
  templateUrl: './conductor.component.html',
  styleUrls: ['./conductor.component.css']
})
export class ConductorComponent {
  blobServiceClient = new BlobServiceClient('DefaultEndpointsProtocol=https;AccountName=storageisw;AccountKey=X1jBQ+Zie8FWDK6xxB0MG34qb5c/MfIK6ODx0onIfpF2eTzQ1lQPgxkY9hbrvQetH9nDX84iuQXk+AStrQ5aLg==;EndpointSuffix=core.windows.net');
  containerClient = this.blobServiceClient.getContainerClient('conductor');

  
  constructor(
    private sqlService:SqlService,
    private authService:AuthService
  ) { }
  tableData
  displayedColumns: string[] = ['nombres', 'apellidos', 'dpi', 'foto_perfil', 'foto_licencia', 'foto_dpi', 'eliminar'];

  nombres
  apellidos
  dpi
  foto_perfil
  foto_licencia
  foto_dpi

  ngOnInit() {
    this.traer_datos()

  }


  traer_datos(){
    this.nombres = ""
    this.apellidos = ""
    this.dpi = ""
    this.foto_dpi = ""
    this.foto_licencia = ""
    this.foto_perfil = ""
     this.sqlService.getData("conductor").subscribe(resp=>{
      this.tableData = resp
    })
  }


  submit(){
      this.sqlService.postData("conductor",{
       "nombres":this.nombres,
       "apellidos":this.apellidos,
       "dpi":this.dpi,
       "foto_perfil":this.foto_perfil,
       "foto_licencia":this.foto_licencia,
       "foto_dpi":this.foto_dpi
     })
     .subscribe(data=>{
       this.traer_datos()
     })
  }



  eliminar_conductor(id){
      this.sqlService.deleteData("conductor", "id_conductor",id)
      .subscribe(data=>{
        this.traer_datos()
      })
  }
  // modificar(){
  //  const file = event.target.files[0];
  //   blob = new Blob([file], { type: file.type });
  // }
  

}
