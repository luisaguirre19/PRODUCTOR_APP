import { Injectable } from '@angular/core';
import { SqlService } from './sql.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //public isAuthenticated: boolean = false;
  isAuthenticated = new Subject<boolean>();
  isAuthenticated_forGuard:boolean = false
  public id_login
  public correo_usuario
  constructor(
    private sqlService:SqlService
  ) { 
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isAuthenticated.next(false);
  }

  login(user:string, pass:string): Promise<boolean> {
    return new Promise((resolve, reject) => {
       this.sqlService.postData("count",[{
        "operacion":"L",
        "sub_operacion":"V",
        "correo":user,
        "pass":pass,
        "sp":"principal_productor"
      }])
      .subscribe(data=>{
        console.log(data[0].resp + ' ' +data)
        if(data[0].resp=="Si"){
          this.id_login = data[0].id_login
          this.correo_usuario = data[0].correo
          this.isAuthenticated_forGuard = true;
          this.isAuthenticated.next(true);
          resolve (true)
        }else{
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
       this.sqlService.postData_beneficio("count",[{
        "operacion":"L",
        "sub_operacion":"V",
        "correo":user,
        "pass":pass,
        "tipo":'P',
        "sp":"principal_beneficio"
      }])
      .subscribe(data=>{
        console.log(data[0].resp + ' ' +data)
        if(data[0].resp=="Si"){
          // this.id_login = data[0].id_login
          // this.correo_usuario = data[0].correo
          // this.isAuthenticated_forGuard = true;
          // this.isAuthenticated.next(true);
          resolve (true)
        }else{

        }
      })
    })
  }
}
