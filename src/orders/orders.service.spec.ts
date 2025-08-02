import { Test, TestingModule } from '@nestjs/testing';
import { ShopsService } from '../shops/shops.service';
import { DATABASE_INSTANCE } from '../database/database.module';
import * as schema from '../database/schema';
import { Logger } from '@nestjs/common';

const mockDb = {
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    onConflictDoUpdate: jest.fn().mockResolvedValue([{}]),
    query: {
        shops: {
            findFirst: jest.fn(),
        },
    },
};

describe('ShopsService', () => {
    let service: ShopsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ShopsService,
                Logger,
                {
                    provide: DATABASE_INSTANCE,
                    useValue: mockDb,
                },
            ],
        }).compile();

        service = module.get<ShopsService>(ShopsService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('deve estar definido', () => {
        expect(service).toBeDefined();
    });

    describe('saveShop', () => {
        it('deve chamar os métodos do banco com os valores corretos para salvar uma loja', async () => {
            const shopDomain = 'loja-teste.myshopify.com';
            const accessToken = 'token-secreto-123';
            const mockReturnValue = [{ id: 'uuid-gerado', nome_loja: shopDomain, access_token: accessToken }];
            mockDb.onConflictDoUpdate.mockResolvedValue(mockReturnValue);

            await service.saveShop(shopDomain, accessToken);

            expect(mockDb.insert).toHaveBeenCalledWith(schema.shops);
            expect(mockDb.values).toHaveBeenCalledWith(
                expect.objectContaining({
                    nome_loja: shopDomain,
                    access_token: accessToken,
                }),
            );
            expect(mockDb.onConflictDoUpdate).toHaveBeenCalledTimes(1);
        });
    });

    describe('findShopByDomain', () => {
        it('deve chamar o findFirst e retornar uma loja se ela existir', async () => {
            const shopDomain = 'loja-existente.com';
            const mockShop = { id: 'uuid-123', nome_loja: shopDomain, access_token: 'token-123' };
            mockDb.query.shops.findFirst.mockResolvedValue(mockShop);

            const result = await service.findShopByDomain(shopDomain);

            expect(mockDb.query.shops.findFirst).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockShop);
        });

        it('deve retornar undefined se a loja não existir', async () => {
            const shopDomain = 'loja-inexistente.com';
            mockDb.query.shops.findFirst.mockResolvedValue(undefined);

            const result = await service.findShopByDomain(shopDomain);

            expect(mockDb.query.shops.findFirst).toHaveBeenCalledTimes(1);
            expect(result).toBeUndefined();
        });
    });
});