import { Controller, Post, Body, Get, Query, Delete, UsePipes, ValidationPipe, Param, Put } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { JogadoresService } from './jogadores.service';
import { Jogador } from './interfaces/jogador.interface';
import { ValidateParameter } from '../common/pipes/validate-parameter.pipe';
import { UpdatePlayerDto } from './dtos/update-player.dto';
@Controller('api/v1/jogadores')
export class JogadoresController {

  constructor(private readonly jogadoresService: JogadoresService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async criarJogador(
    @Body() createPlayerDto: CreatePlayerDto
  ): Promise<Jogador> {
    return await this.jogadoresService.createPlayer(createPlayerDto)
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async atualizarJogador(
    @Body() updatePlayerDto: UpdatePlayerDto,
    @Param('_id', ValidateParameter) _id: string
  ): Promise<void> {
    await this.jogadoresService.updatePlayer(_id, updatePlayerDto)
  }

  @Get()
  async consultarJogadores(): Promise<Jogador[]> {  
    return await this.jogadoresService.consultarTodosJogadores();
  }

  @Get('/:_id')
  async consultarJogadorPeloIp(
    @Param('_id', ValidateParameter) _id: string
  ): Promise<Jogador> {  
      return await this.jogadoresService.searchPlayerForId(_id);
  }

  @Delete('/:_id')
  async deletarJogador(@Param('_id', ValidateParameter) _id: string): Promise<void> {
    this.jogadoresService.removePlayer(_id)
  }
}
