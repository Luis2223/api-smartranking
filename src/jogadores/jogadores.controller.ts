import { Controller, Post, Body } from '@nestjs/common';
import { create } from 'eslint/lib/rules/*';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { JogadoresService } from './jogadores.service';

@Controller('api/v1/jogadores')
export class JogadoresController {

  constructor(private readonly jogadoresService: JogadoresService) {}

  @Post()
  async criarAtualizarJogador(
    @Body() createPlayerDto: CreatePlayerDto
  ) {
    await this.jogadoresService.criarAtualizarJogador(createPlayerDto)
  }
}
