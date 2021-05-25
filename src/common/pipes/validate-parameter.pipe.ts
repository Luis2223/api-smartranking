import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";

export class ValidateParameter implements PipeTransform {
    transform (value: any, metadata: ArgumentMetadata) {

        if (!value) {
            throw new BadRequestException(`The value parameter ${metadata.data} dont not information.`);
        }

        return value;
    }
}