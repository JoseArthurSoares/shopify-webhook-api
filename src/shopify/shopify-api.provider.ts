import '@shopify/shopify-api/adapters/node';
import {FactoryProvider} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {LATEST_API_VERSION, LogSeverity, shopifyApi} from '@shopify/shopify-api';

export const SHOPIFY_API_INSTANCE = 'SHOPIFY_API_INSTANCE';

export const ShopifyApiProvider: FactoryProvider = {
    provide: SHOPIFY_API_INSTANCE,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
        return shopifyApi({
            apiKey: configService.get<string>('SHOPIFY_API_KEY')!,
            apiSecretKey: configService.get<string>('SHOPIFY_API_SECRET')!,
            scopes: configService.get<string>('SHOPIFY_SCOPES')!.split(','),
            hostName: configService.get<string>('HOST')!.replace(/https?:\/\//, ''),
            apiVersion: LATEST_API_VERSION,
            isEmbeddedApp: true,
            logger: {
                level: LogSeverity.Info,
            },
        });
    },
};