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

    async registerOrderCreateWebhook(shop: string, accessToken: string | undefined) {
        const host = this.configService.get<string>('HOST');
        const shopifyApiVersion = this.configService.get<string>('SHOPIFY_API_VERSION');

        const webhookEndpoint = `https://${shop}/admin/api/${shopifyApiVersion}/webhooks.json`;
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
            'Accept': 'application/json',
        };

        try {
            const request = this.httpService.post(webhookEndpoint, webhookPayload, { headers });
            const response = await lastValueFrom(request);

            if (response.status === 201) {
                this.logger.log('Webhook registrado com sucesso (Status 201)!');
            } else {
                this.logger.warn(`Registro de webhook retornou um status inesperado: ${response.status}`);
            }

        } catch (error) {
            this.logger.error('Falha ao registrar webhook:', error.response?.data || error.message);
        }
    }
}
