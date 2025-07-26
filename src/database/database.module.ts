import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as postgres from 'postgres';
import * as schema from './schema';

export const DATABASE_INSTANCE = 'DATABASE_INSTANCE';

@Global()
@Module({
    providers: [
        {
            provide: DATABASE_INSTANCE,
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const connectionString = configService.get<string>('DATABASE_URL')!;
                const client = postgres(connectionString);
                return drizzle(client, { schema });
            },
        },
    ],
    exports: [DATABASE_INSTANCE],
})
export class DatabaseModule {}