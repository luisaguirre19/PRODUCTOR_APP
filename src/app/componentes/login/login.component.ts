import { Component } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string;
  password: string;
  log:boolean=false
  log2:boolean=false
  loading
  dialogRef: MatDialogRef<MatProgressSpinner>;

  constructor(
    private authService:AuthService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,

    ){}


  async onSubmit() {
    this.showLoading()
    this.log = await this.authService.login(this.username, this.password)
    if(this.log){
      this.hideLoading()
      this.log2 = await this.authService.login_beneficio("productor_inicial@gmail.com", "123456")
      if(this.log2){
        this._snackBar.open('Conexion con el beneficio de café exitosa.', '', {
          duration: 3000, // Duración en milisegundos
        });
      }else{
        alert("No fue posible establecer conexión con el beneficio")
      }
    }else{
      this.hideLoading()
      alert("Ingreso no autorizado")
    }
  }

  showLoading() {
    this.dialogRef = this.dialog.open(MatProgressSpinner, {
      disableClose: true,
      panelClass: 'loading-overlay'
    });
  }

  hideLoading() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }


}
