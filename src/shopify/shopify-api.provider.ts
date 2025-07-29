import '@shopify/shopify-api/adapters/node';
import {FactoryProvider} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {DeliveryMethod, LATEST_API_VERSION, LogSeverity, shopifyApi} from '@shopify/shopify-api';
import { EventEmitter2 } from '@nestjs/event-emitter';

export const SHOPIFY_API_INSTANCE = 'SHOPIFY_API_INSTANCE';

export const ShopifyApiProvider: FactoryProvider = {
    provide: SHOPIFY_API_INSTANCE,
    inject: [ConfigService, EventEmitter2],
    useFactory: (configService: ConfigService, eventEmitter: EventEmitter2) => {
        const shopify = shopifyApi({
            apiKey: configService.get<string>('SHOPIFY_API_KEY')!,
            apiSecretKey: configService.get<string>('SHOPIFY_API_SECRET')!,
            scopes: configService.get<string>('SHOPIFY_SCOPES')!.split(','),
            hostName: configService.get<string>('HOST')!.replace(/https?:\/\//, ''),
            apiVersion: LATEST_API_VERSION,
            isEmbeddedApp: false,
            logger: {
                level: LogSeverity.Info,
            },
        });
        shopify.webhooks.addHandlers({
            ORDERS_CREATE: [
                {
                    deliveryMethod: DeliveryMethod.Http,
                    callbackUrl:'/webhooks/orders/create',
                    callback: async (shop, body) => {
                        const orderData = JSON.parse(body);
                        eventEmitter.emit('order.created', {
                            shopDomain: shop,
                            payload: orderData,
                        })
                    }
                }
            ]
        })

        return shopify;
    },
};