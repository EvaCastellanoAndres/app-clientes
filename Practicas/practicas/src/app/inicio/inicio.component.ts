import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ClienteService } from '../Service/cliente.service';

@Component({
  selector: 'app-inicio',
  imports: [CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent implements OnInit {

  listadoClientes: any = [];

  constructor(
    private clienteService: ClienteService,
    private router: Router
  ) {}

  ngOnInit() {
    this.mostrarClientes();
  }

  mostrarClientes() {
    this.clienteService.getClientes().subscribe(clientes => {
      this.listadoClientes = clientes;
    });
  }
  
  annadir() {
    this.router.navigate(['crear'])
  }

  editarCliente(id: number) {
    this.router.navigate(['/editar', id]);
  }

  eliminarCliente(id: number) {
    if (confirm('¿Seguro que deseas eliminar este cliente?')) {
      this.clienteService.eliminarCliente(id).subscribe(() => {
        this.mostrarClientes();
      });
    }
  }
}
