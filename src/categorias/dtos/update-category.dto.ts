import { ArrayMinSize, IsArray, IsOptional, IsString } from "class-validator";
import { Evento } from "../interface/categoria.interface";

export class UpdateCategoryDto {
    @IsString()
    @IsOptional()
    descricao: string;

    @IsArray()
    @ArrayMinSize(1)
    eventos: Array<Evento>
}