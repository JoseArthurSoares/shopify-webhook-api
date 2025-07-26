import {Controller, Get, Query, Res, Redirect} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ShopifyCallbackQueryDto } from './dto/shopify-callback-query.dto';
import { Response } from 'express';
import {ConfigService} from "@nestjs/config";
import {ShopsService} from "../shops/shops.service";

@Controller('auth')
export class AuthController {

  constructor(
      private readonly configService: ConfigService,
      private readonly authService: AuthService,
      private readonly shopsService: ShopsService
  ) {}

  @Get()
  redirectToShopify(@Query('shop') shop: string, @Res() res: Response) {
    const redirectUri = `${this.configService.get('HOST')}/auth/callback`;
    const apiKey = this.configService.get('SHOPIFY_API_KEY');
    const scopes = this.configService.get('SHOPIFY_SCOPES');

    const url = `https://${shop}/admin/oauth/authorize?client_id=${apiKey}&scope=${scopes}&redirect_uri=${redirectUri}`;

    res.redirect(url);
  }

  @Get('callback')
  async handleCallback(
      @Query() query: ShopifyCallbackQueryDto,
      @Res() res: Response
  ) {
    const { shop, hmac, code, state } = query;
    const isValid = this.authService.verifyHmac(query);
    if (!isValid) {
      return res.status(400).send('Verificação HMAC falhou');
    }

    const accessToken = await this.authService.fetchAccessToken(shop, code);

    await this.shopsService.saveShop({
      nome_loja: shop,
      access_token: accessToken,
    });

    return res.send();
  }
}
