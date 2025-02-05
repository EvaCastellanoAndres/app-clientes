import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CrearComponent } from './crear/crear.component';

export const routes: Routes = [
    { path: 'crear', component: CrearComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })

  export class AppRoutingModule { }