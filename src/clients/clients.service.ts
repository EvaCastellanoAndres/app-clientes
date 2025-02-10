import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { promises as fs } from 'fs';

@Injectable()
export class ClientsService {
  private readonly filePath = 'clients.json'
  clients=[{id:5,nombre:'pepe'}];
  async create(createClientDto: CreateClientDto) {
    let clients = await this.readClientsFromFile();

    const newId=this.clients.length>0 
    ? Math.max(...this.clients.map(c=>c.id))+1:1;

    const newClient={id:newId, nombre:createClientDto.nombre};
    //const newClient={id:newId, nombre:'eva'}; 
    
    this.clients.push(newClient);
    await this.writeClientsToFile(clients);

    return newClient;
  }

  findAll() {
    return this.clients;
  }

  findOne(id: number) {
    const client=this.clients.find((e)=>{
      return e.id===id;
    });
    return client;
  }

  update(id: number, updateClientDto: UpdateClientDto) {
    console.log(updateClientDto);
    console.log(Object.keys(updateClientDto));

    const client=this.clients.find((e)=>{
      return e.id===id;
    });
    if(client){
    Object.keys(updateClientDto).forEach((e)=>{
      console.log(e);
      client[e]=updateClientDto[e];
    });
  }
    return `This action updates a #${id} client`;
  }

  remove(id: number) {
    const position=this.clients.findIndex((e)=>{
      return e.id===id;
    });
    console.log('posicion',position);
    this.clients=this.clients.filter((e,index)=>{
      return index!==position;
    })
    return 'cliente borrado';
  }

  private async readClientsFromFile(){
    try{
      const data=await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch(error){
      return[];
    }
  }
  
  private async writeClientsToFile(clients:any[]){
    await fs.writeFile(this.filePath, JSON.stringify(clients, null, 2), 'utf-8');
  }
}