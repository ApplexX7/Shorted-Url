import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prismadb/prisma.service";
import { UrlEntity } from "./entities/url.entity";


@Injectable()
export class UrlsService {
    constructor (private readonly prisma: PrismaService){}


    async getUrls(page: number = 1, limit: number = 15): Promise<UrlEntity[]> {
        return this.prisma.url.findMany({
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        });
    }

    async shortedNewUrls(longUrl : string) : Promise<UrlEntity>{
        const shortCode = Math.random().toString(36).substring(2, 8)
        const newUrl = this.prisma.url.create({
            data : {
                shortCode,
                longUrl
            }
        })
        return newUrl;
    }


    async findUrl (shortCode : string) : Promise<string> {
        const url = await this.prisma.url.findUnique({
            where : {shortCode}
        });
        if (!url) throw new NotFoundException('Short Url not found');
        return (await url).longUrl;
    }
}