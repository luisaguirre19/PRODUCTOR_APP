import { Component, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Route, Router } from '@angular/router';
import { AuthService } from 'src/app/servicios/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private authService:AuthService,
    private router:Router
    ){}

  // @ViewChild('person') btnPerson: MatButton;
  // @ViewChild('solIns') btnSolIns: MatButton;
 // @ViewChild('solCta') btnSolCta: MatButton;
  // @ViewChild('envios') btnEnvios: MatButton;
  // @ViewChild('productores') btnProductores: MatButton;
  log:boolean = false

  ngOnInit() {
    this.valida_login()
  }
  
  async valida_login(){
    await this.authService.isAuthenticated.subscribe(estado => {
      this.log = estado
      // this.btnPerson.disabled = estado
      // this.btnSolIns.disabled = !estado
      //this.btnSolCta.disabled = !estado
      // this.btnEnvios.disabled = !estado
      // this.btnProductores.disabled = !estado
      if(estado){
        this.router.navigate(['/sol-inscripcion'])
      }else{
        this.router.navigate(['/login'])
      }
    });
  }

  salida(){
    this.authService.logout()
  }

  async loguear_beneficio(){
      this.log = await this.authService.login_beneficio("productor_inicial@gmail.com", "123456")
      if(this.log){
        alert("En linea con el beneficio.")
      }else{
        alert("Ingreso por parte del beneficio")
      }
    }

}
