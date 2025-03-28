import {
    ArgumentMetadata,
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
    PipeTransform,
    ValidationError,
  } from '@nestjs/common';
  import { plainToClass } from 'class-transformer';
  import { validate } from 'class-validator';
  
  @Injectable()
  export class ValidationPipe implements PipeTransform<unknown> {
    async transform(value: unknown, metadata: ArgumentMetadata) {
        console.log("here in validation pipeline", value, metadata);
      if (!value) {
        throw new BadRequestException('No data submitted');
      }
  
      const { metatype } = metadata;
      if (!metatype || !this.toValidate(metatype)) {
        return value;
      }
      const object = plainToClass(metatype, value);
      const errors = await validate(object);
      if (errors.length > 0) {
        throw new HttpException(
          { message: 'Input data validation failed', errors: this.buildError(errors) },
          HttpStatus.BAD_REQUEST,
        );
      }
      return value;
    }
  
    private buildError(errors: ValidationError[]): Record<string, string> {
      const result: Record<string, string> = {};
      errors.forEach((el) => {
        const prop = el.property;
        Object.entries(el.constraints ?? []).forEach((constraint) => {
          result[prop + constraint[0]] = `${constraint[1]}`;
        });
      });
      return result;
    }
  
    private toValidate(metatype: unknown): boolean {
      const types = [String, Boolean, Number, Array, Object];
      return !types.find((type) => metatype === type);
    }
  }
  