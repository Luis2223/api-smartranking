import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Jogador } from './interfaces/jogador.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdatePlayerDto } from './dtos/update-player.dto';

@Injectable()
export class JogadoresService {

    constructor(@InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>) {}

    private readonly logger = new Logger(JogadoresService.name);
    
    async createPlayer(createPlayerDto: CreatePlayerDto): Promise<Jogador> {        
        this.logger.log(`createPlayerDto: ${createPlayerDto}`);

        const { email } = createPlayerDto;

        const playerExists = await this.jogadorModel.findOne({ email }).exec();

        if (playerExists) {
            throw new BadRequestException(`Player with e-mail ${email} already registred.`)
        }

         const playerCreate = new this.jogadorModel(createPlayerDto);
         return await playerCreate.save();

    }

    async updatePlayer(_id: String, updatePlayerDto: UpdatePlayerDto): Promise<void> {        
        this.logger.log(`updatePlayerDto: ${updatePlayerDto}`);

        const playerExists = await this.jogadorModel.findOne({ _id }).exec();

        if (!playerExists) {
            throw new NotFoundException(`Player with _id: ${_id} not found.`)
        }

        await this.jogadorModel.findOneAndUpdate({ _id }, {
            $set: updatePlayerDto
        }).exec();
    }

    async consultarTodosJogadores(): Promise<Jogador[]> {
        return await this.jogadorModel.find().exec();
    }

    async searchPlayerForId(_id: string): Promise<Jogador> {
        const playerExists = await this.jogadorModel.findOne({ _id }).exec();
        if (!playerExists) {
            throw new NotFoundException(`Player with id ${_id} not found!`)
        }
        return playerExists
    }

    async removePlayer(_id: string): Promise<any> {
        const playerExists = await this.jogadorModel.findOne({ _id }).exec();

        if (!playerExists) {
            throw new NotFoundException(`Player with _id: ${_id} not found.`)
        }

        return await this.jogadorModel.deleteOne({ _id }).exec();
    }
}
