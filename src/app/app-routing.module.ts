import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from "./componentes/inicio/inicio.component";
import { LoginComponent } from './componentes/login/login.component';
import { SolInscripcionComponent } from './componentes/sol-inscripcion/sol-inscripcion.component';
import { SolCuentaComponent } from './componentes/sol-cuenta/sol-cuenta.component';
import { EnviosComponent } from './componentes/envios/envios.component';
import { ProductoresComponent } from './componentes/productores/productores.component';
import { AuthGuard } from './guards/auth.guard';
import { ConductorComponent } from './componentes/conductor/conductor.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'inicio',
    component: InicioComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'sol-inscripcion',
    component: SolInscripcionComponent,
    canActivate: [AuthGuard] 
  },
  {
    path: 'sol-cuenta',
    component: SolCuentaComponent,
    canActivate: [AuthGuard] 
  },
  {
    path: 'envios',
    component: EnviosComponent,
    canActivate: [AuthGuard] 
  },
  {
    path: 'productores',
    component: ProductoresComponent,
    canActivate: [AuthGuard] 
  },
  {
    path: 'conductor',
    component: ConductorComponent,
    canActivate: [AuthGuard] 
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
