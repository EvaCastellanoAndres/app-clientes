import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../Service/cliente.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ver',
  imports: [CommonModule],
  templateUrl: './ver.component.html',
  styleUrl: './ver.component.scss'
})
export class VerComponent implements OnInit {

  clienteId: string | null = null;
  detallesCliente: any = [];

  constructor (
    private route: ActivatedRoute,
    private clienteService: ClienteService
  ) {

  }

  ngOnInit() {
    this.clienteId = this.route.snapshot.paramMap.get('id');
    if (this.clienteId) {
      this.cargarCliente(this.clienteId);
    }
  }

  cargarCliente(id: string) {
    this.clienteService.obtenerCliente(id).subscribe(cliente => {
      this.detallesCliente = cliente;
    });
  }
}
