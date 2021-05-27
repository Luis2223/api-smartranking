import { BadRequestException, PipeTransform } from '@nestjs/common';
import { DesafioStatus } from '../interfaces/desafio-status.enum';

export class DesafioStatusValidationPipe implements PipeTransform {
    readonly statusPermitido = [
        DesafioStatus.ACEITO,
        DesafioStatus.CANCELADO,
        DesafioStatus.NEGADO,
    ]

    transform(value: any) {
        const status = value.status.toUpperCase();

        if (!this.validateStatus(status)) {
            throw new BadRequestException(`${status} invalid.`)
        }

        return value;
    }

    private validateStatus(status: any) {
        const statusValidate = this.statusPermitido.indexOf(status)
        
        return statusValidate !== -1
    }
}