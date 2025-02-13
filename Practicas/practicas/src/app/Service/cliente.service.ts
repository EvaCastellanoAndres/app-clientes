import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private API_URL='http://10.100.240.93:3000/client';
  private clientes = new BehaviorSubject<any[]>([]);
  clientes$ = this.clientes.asObservable();

  constructor(private http: HttpClient) { }

  getClientes(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL);
  }
  
  /*getClientes() {
    this.http.get<any[]>(this.API_URL).subscribe((data) => {
      this.clientes.next(data);
    })
  }*/
  annadirCliente(cliente: any) {
    const clientesActuales = this.clientes.getValue();
    this.clientes.next([...clientesActuales, cliente]);
  }
}
