import { Component} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    private gralService:GeneralService,
    private router:Router,
      ) { }
  
      correo
      pass
      productor
      nombres
      apellidos
      telefonos
    
 
  ngOnInit() {
  }


  inscribir(){
    this.sqlService.postData_beneficio("incripcion",{
      "correo":this.correo,
      "pass":this.pass,
      "productor":this.productor,
      "nombres":this.nombres,
      "apellidos":this.apellidos,
      "telefonos":this.telefonos  
    })
    .subscribe(data=>{
      if(data[0].resp == 'No'){
        alert("Tu solicitud no pudo completarse, valida que esten todos los datos y que no tengas una solicitud pendiente o aprobada con el mismo correo")
      }else{
        alert("Se ha enviado la solicitud de inscripcion al beneficio, te avisaremos al correo cuando se autorice tu cuenta.")
        this.sqlService.postData("incripcion",{
          "correo":this.correo,
          "pass":this.pass,
        })
        .subscribe(data=>{
          this.limpiar()
        })
      }
    })
  }

  limpiar(){
    this.correo = ""
    this.pass = ""
    this.productor = "" 
    this.nombres = ""
    this.apellidos = ""
    this.telefonos = ""
    this.router.navigate(['/login']);

  }

  

}


