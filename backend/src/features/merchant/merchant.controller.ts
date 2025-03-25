import { Controller, Get, Post, Body } from '@nestjs/common';
import { Merchant } from './merchant.entity';

@Controller('merchants')
export class MerchantController {
    @Get()
    findAll(): Merchant[] {
        // Logic to retrieve all merchants
        return [];
    }

    @Post()
    create(@Body() merchant: Merchant): Merchant {
        // Logic to create a new merchant
        return merchant;
    }
}
