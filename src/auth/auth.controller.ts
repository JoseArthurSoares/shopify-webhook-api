import {Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, Redirect} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import {ConfigService} from "@nestjs/config";

@Controller('auth')
export class AuthController {
  constructor(
      private readonly configService: ConfigService,
      private readonly authService: AuthService
  ) {}

  @Get()
  @Redirect()
  redirectToShopify(@Query('shop') shop: string) {
    const redirectUri = `${this.configService.get('HOST')}/auth/callback`;
    const apiKey = this.configService.get('SHOPIFY_API_KEY');
    const scopes = this.configService.get('SHOPIFY_SCOPES');

    const url = `https://${shop}/admin/oauth/authorize?client_id=${apiKey}&scope=${scopes}&redirect_uri=${redirectUri}`;

    return { url: url };
  }
}
