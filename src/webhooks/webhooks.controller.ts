import {Controller, HttpCode, Inject, Post, Req, Res} from '@nestjs/common';
import { Request, Response } from 'express';
import {SHOPIFY_API_INSTANCE} from "../shopify/shopify-api.provider";
import {Shopify} from "@shopify/shopify-api";

@Controller('webhooks')
export class WebhooksController {
    constructor(
        @Inject(SHOPIFY_API_INSTANCE) private readonly shopify: Shopify,
    ) {}

    @Post('orders/create')
    @HttpCode(200)
    async createOrder(@Req() req: Request, @Res() res: Response) {
        try{
            await this.shopify.webhooks.process({
                rawBody: req.body,
                rawRequest: req,
                rawResponse: res
            })
            console.log('Webhook processado pela biblioteca com sucesso!');
        } catch (error) {
            console.log(error)
        }
    }
}
