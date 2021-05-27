import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JogadoresModule } from './jogadores/jogadores.module';
import { CategoriasModule } from './categorias/categorias.module';
import { DesafiosModule } from './desafios/desafios.module';

@Module({
  imports: [
    MongooseModule.forRoot(`mongodb+srv://admin:${'AbwKNTYBd0ZYMyWC'}@cluster0.6zbes.mongodb.net/smartranking?retryWrites=true&w=majority`, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    }),    
    JogadoresModule, CategoriasModule, DesafiosModule
  ],
})
export class AppModule {}
