import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriasService } from 'src/categorias/categorias.service';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { DesafioStatus } from './interfaces/desafio-status.enum';
import { Desafio } from './interfaces/desafio.interface';

@Injectable()
export class DesafiosService {

    constructor(
        @InjectModel('Desafio') private readonly desafioModel: Model<Desafio>,
        private readonly jogadoresService: JogadoresService,
        private readonly categoriasService: CategoriasService
    ) {}

    async createChallenge(createChallengeDto: CreateChallengeDto): Promise<Desafio> {
        const allPlayers = await this.jogadoresService.consultarTodosJogadores();
        createChallengeDto.jogadores.map(player => {
            const players = allPlayers.filter(playerFill => playerFill._id == player._id);
            if (players.length == 0) {
                throw new BadRequestException(`Player ${player._id} not found`);
            }
        })

        const orderIsPlayerOfChallenge = await createChallengeDto.jogadores.filter(player =>  player._id == createChallengeDto.solicitante);

        if (orderIsPlayerOfChallenge.length == 0) {
            throw new BadRequestException(`Order must be player of challenge.`);
        }

        const categoryPlayer =  await this.categoriasService.searchCategoryToPlayer(createChallengeDto.solicitante);

        if (!categoryPlayer) {
            throw new BadRequestException(`Requester need register into category.`)
        }

        const challengeCreate = new this.desafioModel(createChallengeDto);
        challengeCreate.categoria = categoryPlayer.categoria;
        challengeCreate.dataHoraSolicitacao = new Date();
        challengeCreate.status = DesafioStatus.PENDENTE;

        return await challengeCreate.save();
    }

}
