import { Controller, Post, Body, Get, Query, Delete } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { JogadoresService } from './jogadores.service';
import { Jogador } from './interfaces/jogador.interface';
@Controller('api/v1/jogadores')
export class JogadoresController {

  constructor(private readonly jogadoresService: JogadoresService) {}

  @Post()
  async criarAtualizarJogador(
    @Body() createPlayerDto: CreatePlayerDto
  ) {
    await this.jogadoresService.criarAtualizarJogador(createPlayerDto)
  }

  @Get()
  async consultarJogadores(
    @Query('email') email: string
  ): Promise<Jogador[] | Jogador> {  
    if (email) {
      return await this.jogadoresService.consultarJogadoresPeloEmail(email);
    }
    return await this.jogadoresService.consultarTodosJogadores();
  }


  @Delete()
  async deletarJogador(@Query('email') email: string): Promise<void> {
    this.jogadoresService.deletarJogador(email)
  }
}
