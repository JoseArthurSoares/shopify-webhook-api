import { WebhooksService } from './webhooks.service';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

describe('WebhooksService', () => {
  let service: WebhooksService;
  let shopifyMock: any;
  let configServiceMock: any;
  let loggerMock: any;
  let clientMock: any;

  beforeEach(() => {
    clientMock = {
      get: jest.fn(),
      post: jest.fn(),
    };
    shopifyMock = {
      clients: {
        Rest: jest.fn().mockImplementation(() => clientMock),
      },
    };
    configServiceMock = {
      get: jest.fn().mockReturnValue('http://localhost:3000'),
    };
    loggerMock = {
      log: jest.fn(),
      error: jest.fn(),
    };

    service = new WebhooksService(shopifyMock, configServiceMock as ConfigService);
    // @ts-ignore
    service.logger = loggerMock as Logger;
  });

  it('deve registrar um novo webhook se não existir', async () => {
    clientMock.get.mockResolvedValue({ body: { webhooks: [] } });
    clientMock.post.mockResolvedValue({});

    await service.registerOrderCreateWebhook({} as any);

    expect(clientMock.get).toHaveBeenCalledWith({ path: 'webhooks' });
    expect(clientMock.post).toHaveBeenCalledWith({
      path: 'webhooks',
      data: {
        webhook: {
          topic: 'orders/create',
          address: 'http://localhost:3000/webhooks/orders/create',
          format: 'json',
        },
      },
    });
    expect(loggerMock.log).not.toHaveBeenCalledWith(expect.stringContaining('já existe'));
  });

  it('não deve registrar se o webhook já existir', async () => {
    clientMock.get.mockResolvedValue({
      body: { webhooks: [{ address: 'http://localhost:3000/webhooks/orders/create' }] },
    });

    await service.registerOrderCreateWebhook({} as any);

    expect(clientMock.post).not.toHaveBeenCalled();
    expect(loggerMock.log).toHaveBeenCalledWith(
        'Webhook para http://localhost:3000/webhooks/orders/create já existe.'
    );
  });

  it('deve logar erro se ocorrer exceção', async () => {
    const error = { message: 'Erro', response: { body: 'Detalhes' } };
    clientMock.get.mockRejectedValue(error);

    await service.registerOrderCreateWebhook({} as any);

    expect(loggerMock.error).toHaveBeenCalledWith(
        'Falha no processo de registro do webhook:',
        'Erro'
    );
    expect(loggerMock.error).toHaveBeenCalledWith(
        'Detalhes do erro:',
        'Detalhes'
    );
  });
});