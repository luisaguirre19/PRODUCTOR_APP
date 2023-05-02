import { Component } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string;
  password: string;
  log:boolean=false
  loading
  constructor(
    private authService:AuthService,
    ){}


  async onSubmit() {
    this.loading = true
    this.log = await this.authService.login(this.username, this.password)
    this.loading = false
    if(this.log){
      alert("Bienvenido")
      this.loading = true
      this.log = await this.authService.login_beneficio("productor_inicial@gmail.com", "123456")
      this.loading = false
      if(this.log){
        alert("Bienvenido al beneficio")
      }else{
        alert("Ingreso no autorizado en beneficio")
      }
    }else{
      this.loading = false
      alert("Ingreso no autorizado")
    }
  }


}
