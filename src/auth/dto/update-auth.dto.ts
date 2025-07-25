import { PartialType } from '@nestjs/mapped-types';
import { ShopifyCallbackQueryDto } from './shopify-callback-query.dto';

export class UpdateAuthDto extends PartialType(ShopifyCallbackQueryDto) {}
