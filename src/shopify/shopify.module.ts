import { Global, Module } from '@nestjs/common';
import { ShopifyApiProvider } from './shopify-api.provider';

@Global()
@Module({
    providers: [ShopifyApiProvider],
    exports: [ShopifyApiProvider],
})
export class ShopifyModule {}