import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { Categoria } from './interface/categoria.interface';

@Injectable()
export class CategoriasService {

    constructor(
        @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>
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
        return await this.categoriaModel.find().exec();
    }

    async serachCategoryForId(categoria: string): Promise<Categoria> {
        return await this.categoriaModel.findOne({ categoria }).exec();
    }
}
