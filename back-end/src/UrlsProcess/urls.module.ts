import { Module } from "@nestjs/common";
import { UrlsController } from "./urls.controller";
import { UrlsService } from "./urls.service";
import { PrismaService } from "../prismadb/prisma.service";

@Module({
    imports: [],
    controllers: [UrlsController],
    providers: [UrlsService, PrismaService],
})
export class UrlsModule {}