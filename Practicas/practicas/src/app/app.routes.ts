import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CrearComponent } from './crear/crear.component';
import { InicioComponent } from './inicio/inicio.component';
import { EditarComponent } from './editar/editar.component';

export const routes: Routes = [
    { path: 'inicio', component: InicioComponent},
    { path: 'crear', component: CrearComponent },
    { path: 'editar/:id', component: EditarComponent},
    { path: '**', redirectTo: 'inicio'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })

  export class AppRoutingModule { }