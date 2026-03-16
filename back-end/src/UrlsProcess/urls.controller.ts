import { Controller, Get, Post, Body, Param, Res } from "@nestjs/common";
import { Response } from "express";
import { UrlsService } from "./urls.service";
import { UrlEntity } from "./entities/url.entity";


@Controller()
export class UrlsController {
    constructor(private readonly urlsservice: UrlsService){}

    @Get('/urls')
    getUrls() : Promise<UrlEntity[]> {
        return this.urlsservice.getUrls();
    }

    @Post('/post/newURl')
    createshortUrls(@Body() body: {longUrl: string}) : Promise<UrlEntity>  {
        return this.urlsservice.shortedNewUrls(body.longUrl);
    }

    @Get(':shortCode')
    async redirect(@Param('shortCode') shortCode : string, @Res() res: Response) {
        const longetUrl = await this.urlsservice.findUrl(shortCode);
        return res.redirect(longetUrl);
    }
}