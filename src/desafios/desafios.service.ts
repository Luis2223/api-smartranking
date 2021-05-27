import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriasService } from 'src/categorias/categorias.service';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';
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

    async searchAllChallenge(): Promise<Array<Desafio>> {
        return await this.desafioModel.find()
        .populate('solicitante')
        .populate('jogadores')
        .populate('partida')
        .exec();
    }

    async searchChallengeForId(_id: any): Promise<Array<Desafio>> {
        const players = await this.jogadoresService.consultarTodosJogadores();

        const playersFound = players.filter(player => player._id == _id);

        if (playersFound.length == 0) {
            throw new BadRequestException(`Player ${_id} not register.`)
        }

        return await this.desafioModel.find()
        .populate('solicitante')
        .populate('jogadores')
        .populate('partida')
        .where('jogadores')
        .in(_id)
        .exec()
    }

    async updateChallenge(_id: string, updateChallengeDto: UpdateChallengeDto): Promise<void> {
        const challengeExists = await this.desafioModel.findById(_id).exec();

        if (!challengeExists) {
            throw new NotFoundException(`Challenge ${_id} is not found.`)
        }

        if (updateChallengeDto.status) {
            challengeExists.dataHoraResposta = new Date();
        }
        challengeExists.status = updateChallengeDto.status;
        challengeExists.dataHoraDesafio = updateChallengeDto.dataHoraDesafio

        await this.desafioModel.findOneAndUpdate({ _id }, {
            $set: challengeExists
        }).exec()
    }

}
