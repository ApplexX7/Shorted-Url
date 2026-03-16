import { Module } from '@nestjs/common';
import { UrlsModule } from './UrlsProcess/urls.module';

@Module({
  imports: [UrlsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
