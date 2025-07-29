import {Inject, Injectable, Logger} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {Session, Shopify} from "@shopify/shopify-api";
import {SHOPIFY_API_INSTANCE} from "../shopify/shopify-api.provider";

@Injectable()
export class WebhooksService {
    private readonly logger = new Logger(WebhooksService.name);

    constructor(
        @Inject(SHOPIFY_API_INSTANCE) private readonly shopify: Shopify,
        private readonly configService: ConfigService,
    ) {}

    async registerOrderCreateWebhook(session: Session) {
        const client = new this.shopify.clients.Rest({session});
        const host = this.configService.get<string>('HOST');
        const callbackUrl = `${host}/webhooks/orders-create`;

        try {
            const response = await client.get({ path: 'webhooks' });
            const webhooks = response.body.webhooks as any[];

            const webhookAlreadyExists = webhooks.some(
                (webhook) => webhook.address === callbackUrl,
            );

            if (webhookAlreadyExists) {
                this.logger.log(`Webhook para ${callbackUrl} já existe.`);
                return;
            }

            await client.post({
                path: 'webhooks',
                data: {
                    webhook: {
                        topic: 'orders/create',
                        address: callbackUrl,
                        format: 'json',
                    },
                },
            });

        } catch (error) {
            this.logger.error('Falha no processo de registro do webhook:', error.message);
            if (error.response) {
                this.logger.error('Detalhes do erro:', error.response.body);
            }
        }
    }
}
