import { PartialType } from '@nestjs/mapped-types';
import { CreateClientDto } from './create-client.dto';
import { IsString, IsArray, IsOptional } from 'class-validator';

export class UpdateClientDto extends PartialType(CreateClientDto) {
   @IsArray()
    @IsString({ each: true })
    @IsOptional()
    imagenes?: string[];
}
