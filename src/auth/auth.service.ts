import {Injectable, InternalServerErrorException} from '@nestjs/common';
import { ShopifyCallbackQueryDto } from './dto/shopify-callback-query.dto';
import {HttpService} from '@nestjs/axios';
import {ConfigService} from "@nestjs/config";
import * as crypto from 'crypto';
import {lastValueFrom} from "rxjs";

@Injectable()
export class AuthService {
  private readonly shopifyApiSecret: string;
  private readonly shopifyApiKey: string;

  constructor(
      private readonly configService: ConfigService,
      private readonly httpService: HttpService
  ){
    this.shopifyApiSecret = this.configService.get('SHOPIFY_API_SECRET')!;
    this.shopifyApiKey = this.configService.get('SHOPIFY_API_KEY')!;
  }

  verifyHmac(query: ShopifyCallbackQueryDto) {
    const {hmac, ...rest} = query;

    const message = Object.keys(rest)
        .sort()
        .map((key) => `${key}=${rest[key]}`)
        .join('&');

    const calculatedHmac = crypto
        .createHmac('sha256', this.shopifyApiSecret)
        .update(message)
        .digest('hex');

    return calculatedHmac === hmac;
  }

  async fetchAccessToken(shop: string, code: string) {
    const url = `https://${shop}/admin/oauth/access_token`;

    const body = {
      client_id: this.shopifyApiKey,
      client_secret: this.shopifyApiSecret,
      code
    }

    try {
      const request = this.httpService.post(url, body);
      const response = await lastValueFrom(request);
      return response.data.access_token;
    } catch (error) {
      throw new InternalServerErrorException('Não foi possível obter o token de acesso do Shopify.');
    }
  }
}
