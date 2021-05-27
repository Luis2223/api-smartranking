import {  IsDateString, IsOptional, IsString } from "class-validator";
import { DesafioStatus } from "../interfaces/desafio-status.enum";

export class UpdateChallengeDto {
    @IsDateString()
    @IsOptional()
    dataHoraDesafio: Date;

    @IsString()
    @IsOptional()
    status: DesafioStatus;
}