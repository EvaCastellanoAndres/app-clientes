import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private clientes = new BehaviorSubject<any[]>([]);
  clientes$ = this.clientes.asObservable();

  annadirCliente(cliente: any) {
    const clientesActuales = this.clientes.getValue();
    this.clientes.next([...clientesActuales, cliente]);
  }

  constructor() { }
}
