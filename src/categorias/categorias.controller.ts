import { Body, Post, Put, Controller, UsePipes, ValidationPipe, Get, Param, NotFoundException } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { Categoria } from './interface/categoria.interface';
import { CategoriasValidateParameter } from './pipes/categorias-validate-parameter.pipes';

@Controller('api/v1/categorias')
export class CategoriasController {

    constructor(private readonly categoriasService: CategoriasService) {}

    @Post()
    @UsePipes(ValidationPipe)
    async createCategory(@Body()
        createCategoryDto: CreateCategoryDto
        ): Promise<Categoria> {
        return await this.categoriasService.createCategory(createCategoryDto)
    }

    @Get()
    async searchAllCategorys(): Promise<Array<Categoria>> {
        return await this.categoriasService.searchAllCategorys();
    }
    
    @Get('/:categoria')
    async serachCategoryForId(@Param('categoria') categoria: string): Promise<Categoria> {
        const categoryExists = await this.categoriasService.serachCategoryForId(categoria);

        if (!categoryExists) {
            throw new NotFoundException(`Category ${categoria} not found.`)
        }

        return categoryExists;
    }
    
    @Put('/:categoria')
    @UsePipes(ValidationPipe)
    async updateCategory(
        @Body() updateCategoryDto: UpdateCategoryDto,
        @Param('categoria') categoria: string
    ): Promise<void> {
        await this.categoriasService.updateCategory(categoria, updateCategoryDto);
    }

    @Post('/:categoria/jogadores/:idJogador')
    async addCategoryPlayer(
        @Param() params: string[]
    ): Promise<void> {
        return await this.categoriasService.addCategoryPlayer(params);
    }
}
