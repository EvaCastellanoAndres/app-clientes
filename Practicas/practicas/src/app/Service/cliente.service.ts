import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private API_URL='https://app-clientes-4hsr.onrender.com/client';
  private clientes = new BehaviorSubject<any[]>([]);
  clientes$ = this.clientes.asObservable();

  constructor(private http: HttpClient) { }

  getClientes() {
    return this.http.get(this.API_URL);
  }
  
  crearCliente(cliente: any): Observable<any> {
    return this.http.post<any>(this.API_URL, cliente);
  }

  actualizarCliente(id: number, cliente: any): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/${id}`, cliente);
  }
  
  eliminarCliente(id: number): Observable<any> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
  /*annadirCliente(cliente: any) {
    const clientesActuales = this.clientes.getValue();
    this.clientes.next([...clientesActuales, cliente]);
  }*/
}
