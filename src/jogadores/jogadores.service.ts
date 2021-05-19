import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Jogador } from './interfaces/jogador.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class JogadoresService {

    private jogadores: Jogador[] = [];
    private readonly logger = new Logger(JogadoresService.name);

    async criarAtualizarJogador(createPlayerDto: CreatePlayerDto): Promise<void> {        
        this.logger.log(`createPlayerDto: ${createPlayerDto}`);

        const { email } = createPlayerDto;

        const playerExists = this.jogadores.find((value) => value.email === email)

        if (playerExists) {
            return this.update(playerExists, createPlayerDto);
        }

        this.create(createPlayerDto);
    }

    async consultarTodosJogadores(): Promise<Jogador[]> {
        return this.jogadores;
    }

    async consultarJogadoresPeloEmail(email: string): Promise<Jogador> {
        const playerExists = this.jogadores.find(value => value.email === email);
        if (!playerExists) {
            throw new NotFoundException(`Player with e-mail ${email} not found!`)
        }
        return playerExists
    }

    async deletarJogador(email: string): Promise<void> {
        const playerExists = this.jogadores.find(value => value.email === email);
        this.jogadores = this.jogadores.filter(jogador => jogador.email !== playerExists.email);
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

    private update(playerExists: Jogador, createPlayerDto: CreatePlayerDto): void {
        const { name } = createPlayerDto;

        playerExists.name = name;
    }
}
