import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/servicios/auth.service';
import { SqlService } from 'src/app/servicios/sql.service';
import { BlobServiceClient, AnonymousCredential } from '@azure/storage-blob';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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

  private storageAccountName = 'imgis';
  private containerName = 'blobis';
  private sasToken = 'sp=r&st=2023-05-27T07:43:46Z&se=2023-05-27T15:43:46Z&sv=2022-11-02&sr=c&sig=keVPyHOr44LHEuJRyOd96Ly37btMDYwNSyA9ro28KbU%3D';

  constructor(
    private sqlService:SqlService,
    private authService:AuthService,
    private http: HttpClient
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
    alert(this.authService.correo_usuario)
    this.sqlService.postData("cuenta_pendiente",{"correo":this.authService.correo_usuario}).subscribe(resp=>{
     this.tableData = resp
   })
 }

 onFileSelected(event: Event) {
  alert("ca")
  const file = (event.target as HTMLInputElement).files[0];
  this.uploadFile(file);
  }

  // async uploadImageToAzure(file: File) Promise<string> {
  //   alert(file)
  //   const connectionString = 'DefaultEndpointsProtocol=https;AccountName=<imgis>;AccountKey=</bQ7eZW0nT4k3KxAmoj1f3nN8/qFnx6eiNa8NuzOnIBVGVaGW6HaBLAL8iVfegefaM0nYDhkNRmw+AStZmrrrw==>;EndpointSuffix=core.windows.net';
  //   const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  //   const containerClient = blobServiceClient.getContainerClient('blobis');

  //   const blobName = file.name;
  //   const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  //   await blockBlobClient.uploadBrowserData(file, {
  //     blobHTTPHeaders: { blobContentType: file.type }
  //   });

  //   //await blockBlobClient.uploadData(arrayBuffer);

  //   return `https://${containerClient.accountName}.blob.core.windows.net/${blobName}`;

  // }
  private connectionString = 'DefaultEndpointsProtocol=https;AccountName=imgis;AccountKey=/bQ7eZW0nT4k3KxAmoj1f3nN8/qFnx6eiNa8NuzOnIBVGVaGW6HaBLAL8iVfegefaM0nYDhkNRmw+AStZmrrrw==;EndpointSuffix=core.windows.net';
 // private containerName = 'blobis';

  async uploadFile(file: File): Promise<string> {
    const url = `https://${this.storageAccountName}.blob.core.windows.net/${this.containerName}/${file.name}${this.sasToken}`;

    const headers = new HttpHeaders({
      'x-ms-blob-type': 'BlockBlob',
      'Content-Type': file.type
    });

    await this.http.put(url, file, { headers }).toPromise();

    return url;
  }

  
}
