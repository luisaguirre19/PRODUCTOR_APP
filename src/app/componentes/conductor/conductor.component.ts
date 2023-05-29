import { Component } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { SqlService } from 'src/app/servicios/sql.service';
import { MatTabsModule } from '@angular/material/tabs';
import { DomSanitizer } from '@angular/platform-browser';
import { formatDate } from '@angular/common';
import { finalize, map } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/compat/storage';
@Component({
  selector: 'app-conductor',
  templateUrl: './conductor.component.html',
  styleUrls: ['./conductor.component.css']
})
export class ConductorComponent {

  
  constructor(
    private sqlService:SqlService,
    private authService:AuthService,
    private dom: DomSanitizer,
    private storage: AngularFireStorage
  ) { }
  tableData
  displayedColumns: string[] = ['nombres', 'apellidos', 'dpi', 'foto_perfil', 'foto_licencia', 'foto_dpi', 'eliminar'];

  nombres
  apellidos
  dpi
  foto_perfil
  foto_licencia
  foto_dpi

  imageData
  urlimage
  url_image_dpi:string
  url_image_licencia:string
  url_image_perfil:string
  tipo
  img //para cargar imagenes obtener la url
  path //para devolver el path de la imagen

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
    this.url_image_dpi=""
    this.url_image_licencia=""
    this.url_image_perfil=""
    this.tipo=""
     this.sqlService.postData("get_conductor", {"correo":this.authService.correo_usuario}).subscribe(resp=>{
      this.tableData = resp
    })
  }


  submit(){
      this.sqlService.postData("conductor",{
       "nombres":this.nombres,
       "apellidos":this.apellidos,
       "dpi":this.dpi,
       "foto_perfil":this.url_image_perfil,
       "foto_licencia":this.url_image_licencia,
       "foto_dpi":this.url_image_dpi,
       "correo":this.authService.correo_usuario
     })
     .subscribe(data=>{
      if(data[0].resp =="Si"){
        this.traer_datos()
      }else{
        alert("Fallo carga de conductor")
      }
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


  onUploadImgBrowser_foto_dpi(e){
    this.imageData = this.cargarImageDataBrowser(e)
    this.urlimage =  this.obtieneUrlImageSanitizada( this.imageData)
    this.tipo = "DPI"
    this.enviar_firebase()
  }

  onUploadImgBrowser_foto_licencia(e){
    this.imageData = this.cargarImageDataBrowser(e)
    this.urlimage =  this.obtieneUrlImageSanitizada( this.imageData)
    this.tipo = "licencia"
    this.enviar_firebase()
  }

  onUploadImgBrowser_foto_perfil(e){
    this.imageData = this.cargarImageDataBrowser(e)
    this.urlimage =  this.obtieneUrlImageSanitizada( this.imageData)
    this.tipo = "perfil"
    this.enviar_firebase()
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

    const path = "conductores/" + this.nombres + " " + this.apellidos + '/' + this.tipo + "/" + "  " + formatDate(new Date(), 'dd-MM-yyyy hh:mm:ss a', 'en-US', '+0530') + '.jpg'
        
   
      await this.cargarIMG(path, this.imageData, "").then(
        success =>{
          if(success){
           // alert("DPI " + this.url_image_dpi +"licencia " + this.url_image_licencia + " perfil " + this.url_image_perfil)
          //  this.img =  this.obtenerURL(path)
            //this.submit()
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

        if(this.tipo == "DPI"){
        task.snapshotChanges().pipe(
                                      finalize(() => fileRef.getDownloadURL().subscribe(
                                                        res => resolve( 
                                                          this.url_image_dpi = res
                                                          ),
                                                        err => reject(err)
                                                      )
                                      )
                                    ).subscribe();
        }else if(this.tipo == "licencia"){
          task.snapshotChanges().pipe(
            finalize(() => fileRef.getDownloadURL().subscribe(
                              res => resolve( 
                                this.url_image_licencia = res
                                ),
                              err => reject(err)
                            )
            )
          ).subscribe();
        }else{
          task.snapshotChanges().pipe(
            finalize(() => fileRef.getDownloadURL().subscribe(
                              res => resolve( 
                                this.url_image_perfil = res
                                ),
                              err => reject(err)
                            )
            )
          ).subscribe();
        }
      })
    }else{
      return new Promise<any>((resolve, reject) => {
        const task = fileRef.putString(base, 'data_url');
        if(this.tipo == "DPI"){
          task.snapshotChanges().pipe(
                                        finalize(() => fileRef.getDownloadURL().subscribe(
                                                          res => resolve( 
                                                            this.url_image_dpi = res
                                                            ),
                                                          err => reject(err)
                                                        )
                                        )
                                      ).subscribe();
          }else if(this.tipo == "licencia"){
            task.snapshotChanges().pipe(
              finalize(() => fileRef.getDownloadURL().subscribe(
                                res => resolve( 
                                  this.url_image_licencia = res
                                  ),
                                err => reject(err)
                              )
              )
            ).subscribe();
          }else{
            task.snapshotChanges().pipe(
              finalize(() => fileRef.getDownloadURL().subscribe(
                                res => resolve( 
                                  this.url_image_perfil = res
                                  ),
                                err => reject(err)
                              )
              )
            ).subscribe();
          }
        })
    }

  }

//   obtenerURL(fileName){
//     return this.url_image
//  }

}
