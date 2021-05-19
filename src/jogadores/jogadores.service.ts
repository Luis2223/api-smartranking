import { Injectable, Logger } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Jogador } from './interfaces/jogador.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class JogadoresService {

    private jogadores: Jogador[] = [];
    private readonly logger = new Logger(JogadoresService.name);

    async criarAtualizarJogador(createPlayerDto: CreatePlayerDto): Promise<void> {        
        this.logger.log(`createPlayerDto: ${createPlayerDto}`);
        await this.create(createPlayerDto);
    }

    private create(createPlayerDto: CreatePlayerDto): void {
        const { name, phoneNumber, email } = createPlayerDto;

        const jogador: Jogador = {
            _id: uuidv4(),
            name,
            phoneNumber,
            email,
            ranking: "A",
            rankingPosition: 1,
            urlPictureFriend: 'https://www.google.com/foto123.jpg'
        }

        this.jogadores.push(jogador)
    }
}
