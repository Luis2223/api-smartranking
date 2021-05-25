import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { Categoria } from './interface/categoria.interface';

@Injectable()
export class CategoriasService {

    constructor(
        @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
        private readonly jogadoresService: JogadoresService
    ) {}

    async createCategory(createCategoryDto: CreateCategoryDto): Promise<Categoria> {
        const { categoria } = createCategoryDto;

        const categoryExists = await this.categoriaModel.findOne({ categoria }).exec();

        if (categoryExists) {
            throw new BadRequestException(`Category ${categoria} already exists.`);
        }

        const categoryAlready = new this.categoriaModel(createCategoryDto);
        return await categoryAlready.save();
    }

    async updateCategory(categoria: string, updateCategoryDto: UpdateCategoryDto): Promise<void> {
        const categoryExists = await this.categoriaModel.findOne({ categoria }).exec();

        if (!categoryExists) {
            throw new NotFoundException(`Category ${categoryExists} not found.`)
        }
        
        await this.categoriaModel.findOneAndUpdate({ categoria }, {
            $set: updateCategoryDto
        }).exec();
    }

    async searchAllCategorys(): Promise<Array<Categoria>> {
        return await this.categoriaModel.find().populate('jogadores').exec();
    }

    async serachCategoryForId(categoria: string): Promise<Categoria> {
        return await this.categoriaModel.findOne({ categoria }).exec();
    }

    async addCategoryPlayer(params: string[]): Promise<void> {
        const categoria = params['categoria'];
        const idJogador = params['idJogador'];

        const categoryExists = await this.categoriaModel.findOne({ categoria }).exec();
        const playerExistsWithCategory = await this.categoriaModel.find({ categoria }).where('jogadores').in(idJogador).exec();

        await this.jogadoresService.searchPlayerForId(idJogador);

        if (!categoryExists) {
            throw new BadRequestException(`Category ${categoria} not exists!`)
        }

        if (playerExistsWithCategory.length > 0) {
            throw new BadRequestException(`Player with id ${idJogador} already exists in category ${categoria}.`)
        }

        categoryExists.jogadores.push(idJogador);
        await this.categoriaModel.findOneAndUpdate({ categoria }, { $set: categoryExists }).exec();
    }
}
