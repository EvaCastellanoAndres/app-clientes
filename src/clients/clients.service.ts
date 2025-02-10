import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import  * as fs from 'fs';
import  { promises as fs2 } from 'fs'; // solucion mia al error que daba en las lineas 97-105
import * as path from 'path';
import { FILTER_CATCH_EXCEPTIONS } from '@nestjs/common/constants';

@Injectable()
export class ClientsService {
  // para guardar los datos en un json
  private filePath = path.join(__dirname, '..', '..', 'data', 'clients.json');
  constructor() {
    this.ensureFileExists();
  }

  private ensureFileExists() {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([]));
    }
  }

  private readData(): any[] {
    const data = fs.readFileSync(this.filePath, 'utf8');
    return JSON.parse(data);
  }

  private writeData(data: any[]) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  }

  getClientes(): any[] {
    return this.readData();
  }

  addCliente(cliente: any) {
    const clientes = this.readData();
    clientes.push(cliente);
    this.writeData(clientes);
    return cliente;
  }
  // hasta aqui


  //clients=[{id:5,nombre:'pepe'}];
  

  async create(createClientDto: CreateClientDto) {
    let clients = await this.readClientsFromFile();

    const newId=clients.length>0 
    ? Math.max(...clients.map(c=>c.id))+1:1;

    const newClient={id:newId, nombre:createClientDto.nombre, codigo:createClientDto.codigo, apellido1:createClientDto.apellido1, apellido2:createClientDto.apellido2, identificacion:createClientDto.identificacion, fechaNacimiento:createClientDto.fechaNacimiento, calle:createClientDto.calle, portal:createClientDto.portal, piso:createClientDto.piso, escalera:createClientDto.escalera, codigoPostal:createClientDto.codigoPostal, ciudad:createClientDto.ciudad, provincia:createClientDto.provincia, poblacion:createClientDto.poblacion};
     
    
    clients.push(newClient);
    await this.writeClientsToFile(clients);

    return newClient;
  }

  async findAll() {
    return await this.readClientsFromFile();
  }

  async findOne(id: number) {
    const client = await this.readClientsFromFile();
    return client.find(client => client.id === id);
    }

async update(id: number, updateClientDto: UpdateClientDto) {
  const clients = await this.readClientsFromFile();
  
  const clientIndex = clients.findIndex((client) => client.id === id);
  
  if (clientIndex !== -1) {
    const client = clients[clientIndex];
    Object.keys(updateClientDto).forEach((key) => {
      client[key] = updateClientDto[key];
    });
    
    await this.writeClientsToFile(clients);

    return client;
  } else {
    throw new Error(`Cliente con ID ${id} no encontrado.`);
  }
}


async remove(id: number) {
  const clients = await this.readClientsFromFile(); 

  // Comprobar que clients sea un array
  if (!Array.isArray(clients)) {
    throw new Error('Datos del archivo son incorrectos');
  }

  const position = clients.findIndex((e) => e.id === id);
  console.log('posicion', position);

  if (position !== -1) {
    const updatedClients = clients.filter((e, index) => index !== position);

    await this.writeClientsToFile(updatedClients);
    return 'Cliente borrado';
  } else {
    throw new Error(`Cliente con ID ${id} no encontrado.`);
  }
}

  private async readClientsFromFile(){
    try{
      const data=await fs2.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch(error){
      return[];
    }
  }
  
  private async writeClientsToFile(clients:any[]){
    await fs2.writeFile(this.filePath, JSON.stringify(clients, null, 2), 'utf-8');
  }
}