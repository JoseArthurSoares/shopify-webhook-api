import {Injectable, Logger} from '@nestjs/common';
import {HttpService} from "@nestjs/axios";
import {ConfigService} from "@nestjs/config";
import {lastValueFrom} from "rxjs";

@Injectable()
export class WebhooksService {
    private readonly logger = new Logger(WebhooksService.name);

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {}

    async registerOrderCreateWebhook(shop: string, accessToken: string) {
        const host = this.configService.get<string>('HOST');
        const apiVersion = this.configService.get<string>('SHOPIFY_API_VERSION');

        const url = `https://${shop}/admin/api/${apiVersion}/webhooks.json`;

        const webhookPayload = {
            webhook: {
                topic: 'orders/create',
                address: `${host}/webhooks/orders-create`,
                format: 'json',
            },
        };
        const headers = {
            'X-Shopify-Access-Token': accessToken,
            'Content-Type': 'application/json',
        };

        try {
            const request = this.httpService.post(url, webhookPayload, {headers});
            await lastValueFrom(request);
            this.logger.log('Webhook criado');
        } catch (e) {
            this.logger.error(e);
        }

    }
}
