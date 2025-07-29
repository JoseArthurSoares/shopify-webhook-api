import {Controller, Get, Query, Res, Inject, Req} from '@nestjs/common';
import { Response } from 'express';
import {ShopsService} from "../shops/shops.service";
import {WebhooksService} from "../webhooks/webhooks.service";
import {SHOPIFY_API_INSTANCE} from "../shopify/shopify-api.provider";
import {Shopify} from "@shopify/shopify-api";

@Controller('auth')
export class AuthController {

  constructor(
      @Inject(SHOPIFY_API_INSTANCE) private readonly shopify: Shopify,
      private readonly shopsService: ShopsService,
      private readonly webhooksService: WebhooksService,
  ) {}

  @Get()
  async redirectToShopify(@Query('shop') shop: string, @Req() req: Request, @Res() res: Response) {
    await this.shopify.auth.begin({
      shop,
      callbackPath: '/auth/callback',
      isOnline: false,
      rawRequest: req,
      rawResponse: res,
    });
  }

  @Get('callback')
  async handleCallback(
      @Req() req: Request,
      @Res() res: Response
  ) {

    const callbackResponse = await this.shopify.auth.callback({
      rawRequest: req,
      rawResponse: res,
    })

    const { session } = callbackResponse

    await this.shopsService.saveShop(
        session.shop,
        session.accessToken!,
    );

    await this.webhooksService.registerOrderCreateWebhook(session.shop, session.accessToken);

    return res.send('Loja conectada e webhook criado.');
  }
}
