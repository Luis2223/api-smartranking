import { Controller, Post, Body, UsePipes, ValidationPipe, Query, Logger, Get, Put, Param } from '@nestjs/common';
import { DesafiosService } from './desafios.service';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { MatchGameChallengeDto } from './dtos/match-game-challenge.dto';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';
import { Desafio } from './interfaces/desafio.interface';
import { DesafioStatusValidationPipe } from './pipes/desafios-status-validation.pipe';

@Controller('api/v1/desafios')
export class DesafiosController {

    constructor(
        private readonly desafiosService: DesafiosService,
    ) {}

    private readonly logger = new Logger(DesafiosController.name);

    @Post()
    @UsePipes(ValidationPipe)
    async createChallenge(
        @Body() createChallengeDto: CreateChallengeDto 
    ): Promise<Desafio> {
        this.logger.log(`receveid challenge ${JSON.stringify(createChallengeDto)}`)
        return await this.desafiosService.createChallenge(createChallengeDto)
    }

    @Get()
    async searchChallenges(
        @Query('idJogador') _id: string
    ): Promise<Array<Desafio>> {
        return _id ? await this.desafiosService.searchChallengeForId(_id) 
        : await this.desafiosService.searchAllChallenge();
    }

    @Put('/:desafio')
    async updateChallenge(
        @Body(DesafioStatusValidationPipe) updateChallengeDto: UpdateChallengeDto,
        @Param('desafio') _id: string
    ): Promise<void> {
        await this.desafiosService.updateChallenge(_id, updateChallengeDto);
    }

    @Post('/:desafio/partida')
    async matchGameChallenge(
        @Body(ValidationPipe) matchGameChallengeDto: MatchGameChallengeDto,
        @Param('desafio') _id: string
    ): Promise<void> {
        return await this.desafiosService.matchGameChallenge(_id, matchGameChallengeDto);
    }

}
