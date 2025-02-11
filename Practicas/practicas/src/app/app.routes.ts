import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CrearComponent } from './crear/crear.component';
import { InicioComponent } from './inicio/inicio.component';

export const routes: Routes = [
    { path: 'crear', component: CrearComponent },
    { path: '', component: InicioComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })

  export class AppRoutingModule { }