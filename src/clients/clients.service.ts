import { Injectable } from '@nestjs/common';
import { UpdateClientDto } from './dto/update-client.dto';
import * as fs from 'fs';
import { promises as fsPromises } from 'fs';
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

  async readClientsFromFile() {
    try {
      const data = await fsPromises.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  private async writeClientsToFile(clients: any[]) {
    await fsPromises.writeFile(
      this.filePath,
      JSON.stringify(clients, null, 2),
      'utf-8',
    );
  }

  async create(createClientDto: any, imageUrls: string[]) {
    let clients = await this.readClientsFromFile();
    if (
      clients.some(
        (client) => client.identificacion === createClientDto.identificacion,
      )
    ) {
      throw new Error('La identificación ya está en uso.');
    }
    if (clients.some((client) => client.codigo === createClientDto.codigo)) {
      throw new Error('El código ya está en uso.');
    }
    const newId = clients.length > 0 ? Math.max(...clients.map((c) => c.id)) + 1 : 1;
    const newClient = {
      id: newId,
      nombre: createClientDto.nombre,
      codigo: createClientDto.codigo,
      apellido1: createClientDto.apellido1,
      apellido2: createClientDto.apellido2,
      identificacion: createClientDto.identificacion,
      fechaNacimiento: createClientDto.fechaNacimiento,
      calle: createClientDto.calle,
      numero: createClientDto.numero,
      piso: createClientDto.piso,
      escalera: createClientDto.escalera,
      codigoPostal: createClientDto.codigoPostal,
      ciudad: createClientDto.ciudad,
      provincia: createClientDto.provincia,
      imagenes: imageUrls,
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
    return clients.find((client: { id: number }) => client.id === id);
  }

  async update(
    id: number,
    updateClientDto: UpdateClientDto,
    imageUrls: string[],
  ): Promise<any> {
    const clients = await this.readClientsFromFile();
    const clientIndex = clients.findIndex(
      (client: { id: number }) => client.id === id,
    );

    if (!clients) {
      throw new Error(`Cliente con ID ${id} no encontrado.`);
    }
    clients.images = imageUrls;
    const client = clients[clientIndex];

    const existingImages = client.imagenes || [];
    const newImages = imageUrls || [];

    if (existingImages.length + newImages.length > 4) {
      throw new Error('Solo se pueden subir hasta 4 imágenes por cliente.');
    }
    const mergedImages = [...new Set([...existingImages, ...newImages])];

    clients[clientIndex] = {
      ...client,
      ...updateClientDto,
      imagenes: mergedImages,
    };

    await this.writeClientsToFile(clients);
    return clients[clientIndex];
  }

  async remove(id: number) {
    const clients = await this.readClientsFromFile();
    const position = clients.findIndex((e) => e.id === id);

    if (position !== -1) {
      const client = clients[position]; 
      const imagesToDelete = client.imagenes || []; 

      for (const imageName of imagesToDelete) {
        const absolutePath = path.join(
          __dirname,
          '..',
          '..',
          'data',
          'uploads',
          imageName,
        ); // Reconstruir la ruta
        try {
          await fsPromises.unlink(absolutePath);
        } catch (error) {
          console.error(`Error al borrar la imagen ${absolutePath}:`, error);
        }
      }

      const updatedClients = clients.filter((_, index) => index !== position);
      await this.writeClientsToFile(updatedClients);

      return { message: `Cliente con ID ${id} eliminado.` };
    } else {
      throw new Error(`Cliente con ID ${id} no encontrado.`);
    }
  }

  async saveClientImages(id: number, files: Express.Multer.File[]) {
    const clients = await this.readClientsFromFile();
    const clientIndex = clients.findIndex(
      (client: { id: number }) => client.id === id,
    );

    if (clientIndex === -1) {
      throw new Error(`Cliente con ID ${id} no encontrado.`);
    }
    const imagePaths = files.map((file) => `/data/uploads/${file.filename}`);

    if (!clients[clientIndex].imagenes) {
      clients[clientIndex].imagenes = [];
    }
  }
}
