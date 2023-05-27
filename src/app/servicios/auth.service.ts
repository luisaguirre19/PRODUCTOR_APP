import { Injectable } from '@angular/core';
import { SqlService } from './sql.service';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //public isAuthenticated: boolean = false;
  isAuthenticated = new Subject<boolean>();
  isAuthenticated_forGuard:boolean = false
  token_beneficio
  public id_login
  public correo_usuario
  public token_productor
  constructor(
    private sqlService:SqlService,
    private _snackBar: MatSnackBar,
    private router: Router
    ) { 
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isAuthenticated.next(false);
  }

  login(user:string, pass:string): Promise<boolean> {
    return new Promise((resolve, reject) => {
       this.sqlService.postData("count",{
        "correo":CryptoJS.AES.encrypt(user, 'user2023').toString(),
        "pass":CryptoJS.AES.encrypt(pass, 'pass2023').toString()
      })
      .subscribe(data=>{
        if(data[0].resp=="Si"){
          this._snackBar.open('Validación de credenciales exitosa, bienvenido nuevamente', '', {
            duration: 3000, // Duración en milisegundos
          });
          this.id_login = data[0].id_login
          this.correo_usuario = user
          this.token_productor = data[0].token
          this.isAuthenticated_forGuard = true;
          this.isAuthenticated.next(true);
          this.router.navigate(['/sol-cuenta']);
          resolve (true)
        }else{
          this._snackBar.open('Credenciales incorrectas, ingreso no autorizado', '', {
            duration: 3000, // Duración en milisegundos
          });
          this.logout()
          resolve (false)
        }
      })
    })
  }

  logout() {
    // lógica de cierre de sesión
    this.isAuthenticated.next(false);
    this.isAuthenticated_forGuard = false;
    this.id_login = ""
    this.correo_usuario = ""
  }

  Authenticated() {
    return this.isAuthenticated;
  }

  login_beneficio(user:string, pass:string): Promise<boolean> {
    return new Promise((resolve, reject) => {
       this.sqlService.postData_beneficio("count",{
        "correo":user,
        "pass":pass
      })
      .subscribe(data=>{
        if(data[0].resp=="Si"){
          this.token_beneficio = data[0].token
          // this.id_login = data[0].id_login
          // this.correo_usuario = data[0].correo
          // this.isAuthenticated_forGuard = true;
          // this.isAuthenticated.next(true);
          resolve (true)
        }else{
          resolve (false)

        }
      })
    })
  }
}
