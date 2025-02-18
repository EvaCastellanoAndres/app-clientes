import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, debounceTime, switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private API_URL='https://app-clientes-4hsr.onrender.com/client';
  /*private clientes = new BehaviorSubject<any[]>([]);
  clientes$ = this.clientes.asObservable();*/

  constructor(private http: HttpClient) { }

  getClientes(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL);
  }

  obtenerCliente(id: string):Observable<any> {
    return this.http.get(`${this.API_URL}/${id}`);
  }
  
  crearCliente(cliente: any): Observable<any> {
    return this.http.post<any>(this.API_URL, cliente);
  }

  actualizarCliente(id: string, cliente: any): Observable<any> {
    console.log("Enviando datos al servidor:", cliente);
    return this.http.patch<any>(`${this.API_URL}/${id}`, cliente);
  }
  
  eliminarCliente(id: number): Observable<any> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  verificarCodigoExistente(codigo: string): Observable<boolean> {
    return this.http.get<any[]>(this.API_URL).pipe(
      map((clientes) => {
        return clientes.some((cliente) => cliente.codigo === codigo);
      })
    );
  }

  verificarIdentificacionExistente(identificacion: string): Observable<boolean> {
    return this.http.get<any[]>(this.API_URL).pipe(
      map((clientes) => {
        return clientes.some((cliente) => cliente.identificacion === identificacion);
      }),
      catchError(() => of(false))
    );
  }
}
