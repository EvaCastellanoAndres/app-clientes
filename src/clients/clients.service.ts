import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import * as fs from 'fs';
import { promises as fs2 } from 'fs';
import * as path from 'path';

@Injectable()
export class ClientsService {
  private filePath = path.join(__dirname, '..', '..', 'data', 'clients.json');

  constructor() {
    this.ensureFileExists();
  }

  private ensureFileExists() {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([]));
    }
  }

  private async readClientsFromFile() {
    try {
      const data = await fs2.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  private async writeClientsToFile(clients: any[]) {
    await fs2.writeFile(this.filePath, JSON.stringify(clients, null, 2), 'utf-8');
  }

  async create(createClientDto: CreateClientDto, files?: Express.Multer.File[]) {
    let clients = await this.readClientsFromFile();

    const newId = clients.length > 0 ? Math.max(...clients.map(c => c.id)) + 1 : 1;

    const newClient = {
      id: newId,
      nombre: createClientDto.nombre,
      codigo: createClientDto.codigo,
      apellido1: createClientDto.apellido1,
      apellido2: createClientDto.apellido2,
      identificacion: createClientDto.identificacion,
      fechaNacimiento: createClientDto.fechaNacimiento,
      calle: createClientDto.calle,
      portal: createClientDto.portal,
      piso: createClientDto.piso,
      escalera: createClientDto.escalera,
      codigoPostal: createClientDto.codigoPostal,
      ciudad: createClientDto.ciudad,
      provincia: createClientDto.provincia,
      poblacion: createClientDto.poblacion,
      imagenes: files ? files.map(file => `/data/uploads/${file.filename}`) : []
    };

    clients.push(newClient);
    await this.writeClientsToFile(clients);

    return newClient;
  }

  async findAll() {
    return await this.readClientsFromFile();
  }

  async findOne(id: number) {
    const clients = await this.readClientsFromFile();
    return clients.find(client => client.id === id);
  }

  async update(id: number, updateClientDto: UpdateClientDto, files?: Express.Multer.File[]) {
    const clients = await this.readClientsFromFile();
    const clientIndex = clients.findIndex(client => client.id === id);

    if (clientIndex === -1) {
      throw new Error(`Cliente con ID ${id} no encontrado.`);
    }

    const client = clients[clientIndex];

    // Mantener imágenes existentes si no se envían nuevas
    const existingImages = client.imagenes || [];
    const newImages = files ? files.map(file => `/data/uploads/${file.filename}`) : [];

    if (existingImages.length + newImages.length > 4) {
      throw new Error('Solo se pueden subir hasta 4 imágenes por cliente.');
    }

    clients[clientIndex] = {
      ...client,
      ...updateClientDto,
      imagenes: [...existingImages, ...newImages]
    };

    await this.writeClientsToFile(clients);
    return clients[clientIndex];
  }

  async remove(id: number) {
    const clients = await this.readClientsFromFile();
    const position = clients.findIndex((e) => e.id === id);

    if (position !== -1) {
      const updatedClients = clients.filter((_, index) => index !== position);
      await this.writeClientsToFile(updatedClients);
      return 'Cliente borrado';
    } else {
      throw new Error(`Cliente con ID ${id} no encontrado.`);
    }
  }
}
