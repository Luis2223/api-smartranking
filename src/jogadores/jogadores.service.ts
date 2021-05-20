import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Jogador } from './interfaces/jogador.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JogadoresService {

    private jogadores: Jogador[] = [];

    constructor(@InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>) {}

    private readonly logger = new Logger(JogadoresService.name);

    async criarAtualizarJogador(createPlayerDto: CreatePlayerDto): Promise<void> {        
        this.logger.log(`createPlayerDto: ${createPlayerDto}`);

        const { email } = createPlayerDto;

        const playerExists = await this.jogadorModel.findOne({ email }).exec();

        if (playerExists) {
            this.update(createPlayerDto);
        }

        this.create(createPlayerDto);
    }

    async consultarTodosJogadores(): Promise<Jogador[]> {
        return await this.jogadorModel.find().exec();
    }

    async consultarJogadoresPeloEmail(email: string): Promise<Jogador> {
        const playerExists = await this.jogadorModel.findOne({ email }).exec();
        if (!playerExists) {
            throw new NotFoundException(`Player with e-mail ${email} not found!`)
        }
        return playerExists
    }

    async deletarJogador(email: string): Promise<any> {
        return await this.jogadorModel.remove({ email }).exec();
    }

    private async create(createPlayerDto: CreatePlayerDto): Promise<Jogador> {
        // Cria a instancia jogador
        const playerCreate = new this.jogadorModel(createPlayerDto);

        // persiste os dados no mongodb
        return await playerCreate.save();

    }

    private async update(createPlayerDto: CreatePlayerDto): Promise<Jogador> {
        return await this.jogadorModel.findOneAndUpdate({ email: createPlayerDto.email }, {
            $set: createPlayerDto
        }).exec();
    }
}
