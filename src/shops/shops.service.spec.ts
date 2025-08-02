import { Test, TestingModule } from '@nestjs/testing';
import { ShopsService } from './shops.service';
import { DATABASE_INSTANCE } from '../database/database.module';

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

    describe('saveShop', () => {
        it('deve chamar os métodos do banco de dados com os valores corretos', async () => {
            const shopDomain = 'loja-teste.myshopify.com';
            const accessToken = 'token-secreto-123';

            const mockReturnValue = [{ id: 'uuid-gerado', nome_loja: shopDomain, access_token: accessToken }];
            mockDb.onConflictDoUpdate.mockResolvedValue(mockReturnValue);

            await service.saveShop(shopDomain, accessToken);

            expect(mockDb.insert).toHaveBeenCalledWith(expect.anything());
            expect(mockDb.values).toHaveBeenCalledWith({
                id: expect.any(String),
                nome_loja: shopDomain,
                access_token: accessToken,
            });
            expect(mockDb.onConflictDoUpdate).toHaveBeenCalledTimes(1);
        });
    });


    it('deve retornar uma loja quando ela existe', async () => {
        const shopDomain = 'dominio.com';
        const mockShop = { id: 'uuid-123', nome_loja: shopDomain, access_token: 'token-123' };

        mockDb.query.shops.findFirst.mockResolvedValue(mockShop);

        const result = await service.findShopByDomain(shopDomain);

        expect(mockDb.query.shops.findFirst).toHaveBeenCalledTimes(1);

        expect(result).toEqual(mockShop);
    });
});