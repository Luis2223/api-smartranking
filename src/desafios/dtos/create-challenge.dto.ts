import { ArrayMaxSize, ArrayMinSize, IsArray, IsDateString, IsNotEmpty } from "class-validator";
import { Jogador } from "src/jogadores/interfaces/jogador.interface";

export class CreateChallengeDto {
    @IsNotEmpty()
    @IsDateString()
    dataHoraDesafio: Date;

    @IsNotEmpty()
    solicitante: string;

    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(2)
    jogadores: Array<Jogador>;
}