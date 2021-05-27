import { Controller, Post, Body, UsePipes, ValidationPipe, Logger } from '@nestjs/common';
import { DesafiosService } from './desafios.service';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { Desafio } from './interfaces/desafio.interface';

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

}
