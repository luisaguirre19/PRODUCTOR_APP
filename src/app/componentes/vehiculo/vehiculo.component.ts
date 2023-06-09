import { Component } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { SqlService } from 'src/app/servicios/sql.service';
import { DomSanitizer } from '@angular/platform-browser';
import { formatDate } from '@angular/common';
import { finalize, map } from 'rxjs/operators';
import { AngularFireStorage } from "@angular/fire/compat/storage";

@Component({
  selector: 'app-vehiculo',
  templateUrl: './vehiculo.component.html',
  styleUrls: ['./vehiculo.component.css']
})
export class VehiculoComponent {
  constructor(
    private sqlService:SqlService,
    private authService:AuthService,
    private dom: DomSanitizer,
    private storage: AngularFireStorage
  ) { 
    //this.blobServiceClient = new BlobServiceClient('DefaultEndpointsProtocol=https;AccountName=imgis;AccountKey=/bQ7eZW0nT4k3KxAmoj1f3nN8/qFnx6eiNa8NuzOnIBVGVaGW6HaBLAL8iVfegefaM0nYDhkNRmw+AStZmrrrw==;EndpointSuffix=core.windows.net');
  }
  tableData
  displayedColumns: string[] = ['Marca', 'Color', 'Placa', 'eliminar'];
  Marca
  Color
  Placa
 // private blobServiceClient: BlobServiceClient;
 imageData
 urlimage
 url_image:string
 img //para cargar imagenes obtener la url
 path //para devolver el path de la imagen
  ngOnInit() {
    this.traer_datos()

  }


  traer_datos(){
    this.Marca = ""
    this.Color = ""
    this.Placa = ""
     this.sqlService.postData("get_transporte", {"correo":this.authService.correo_usuario}).subscribe(resp=>{
      this.tableData = resp
    })
  }

  desactivar_cuenta(id:number){
    this.sqlService.putData("count","id_usuario",id,"estado","R").subscribe((resp)=>{
      this.traer_datos()
    })
  }

  submit(){
    alert("enviaremos")
      this.sqlService.postData("transporte",{
       "correo":this.authService.correo_usuario,
       "marca":this.Marca,
       "color":this.Color,
       "placa":this.Placa,
       "url_img":this.url_image
     })
     .subscribe(data=>{
      if(data[0].resp ='Si'){
        this.traer_datos()
      }else{
        alert("No se pudo ingresar el vehiculo, verifica los datos.")
      }
     })
  }

  eliminar_vehiculo(id){
      this.sqlService.deleteData("transporte", "id_transporte",id)
      .subscribe(data=>{
        this.traer_datos()
      })
  }




  onUploadImgBrowser(e){
    console.log(2)
    this.imageData = this.cargarImageDataBrowser(e)
    this.urlimage =  this.obtieneUrlImageSanitizada( this.imageData)
   
  }

  cargarImageDataBrowser(e){
    if(e.target.files.length > 1){
      for (let i = 0; i < e.target.files.length; i++) {
        if(e.target.files[i].size > 2000000){
        //  this.presentAlert('Imagen muy pesada',"La imagen es mayor a 2 MB","Le recomendamos descargar de su pagina de facebook la imagen o utilizar una imagen que se haya enviado por wathsapp para disminuir el peso.")
          return
        }
      }
      return  e.target.files;
    }else{
      if(e.target.files[0].size > 2000000){
       // this.presentAlert('Imagen muy pesada',"La imagen es mayor a 2 MB","Le recomendamos descargar de su pagina de facebook la imagen o utilizar una imagen que se haya enviado por wathsapp para disminuir el peso.")
        return
      }
      return  e.target.files[0];
    }
  }

  obtieneUrlImageSanitizada(file){
    var TmpPath = URL.createObjectURL(file);
    return this.dom.bypassSecurityTrustUrl(TmpPath);  
  }


  async enviar_firebase(){
    let data:any = []

    const path = this.authService.correo_usuario + '/'+ "  " + formatDate(new Date(), 'dd-MM-yyyy hh:mm:ss a', 'en-US', '+0530') + '.jpg'
        
   
      await this.cargarIMG(path, this.imageData, "").then(
        success =>{
          if(success){
            this.img =  this.obtenerURL(path)
            alert("img " + this.img)
            this.submit()
          }
        }
      ).catch(err => { 
      });
  }


  cargarIMG(fileName:string, file:any, base?:any){
    const fileRef = this.storage.ref(fileName);
    if(!base){
      return new Promise<any>((resolve, reject) => {
        const task =  this.storage.upload(fileName, file);
        task.snapshotChanges().pipe(
                                      finalize(() => fileRef.getDownloadURL().subscribe(
                                                        res => resolve( this.url_image = res),
                                                        err => reject(err)
                                                      )
                                      )
                                    ).subscribe();
      })
    }else{
      return new Promise<any>((resolve, reject) => {
        const task = fileRef.putString(base, 'data_url');
        task.snapshotChanges().pipe(
                finalize(() => fileRef.getDownloadURL().subscribe(
                    res => resolve( this.url_image = res),
                    err => reject(err)
                ))).subscribe();
        })
    }

  }

  obtenerURL(fileName){
    return this.url_image
 }


}
