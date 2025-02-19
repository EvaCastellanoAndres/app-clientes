import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CrearComponent } from './crear/crear.component';
import { InicioComponent } from './inicio/inicio.component';
import { EditarComponent } from './editar/editar.component';
import { VerComponent } from './ver/ver.component';

export const routes: Routes = [
    { path: 'inicio', component: InicioComponent},
    { path: 'crear', component: CrearComponent },
    { path: 'editar/:id', component: EditarComponent},
    { path: 'ver/:id', component: VerComponent},
    { path: '**', redirectTo: 'inicio'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })

  export class AppRoutingModule { }