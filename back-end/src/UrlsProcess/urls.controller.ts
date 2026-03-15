import { Controller, Get, Post, Body, Param, Res } from "@nestjs/common";
import { UrlsService } from "./urls.service";


@Controller()
export class UrlsController {
    constructor(private readonly urlsservice: UrlsService){}

    @Get('/urls')
    getUrls()  {
        return this.urlsservice.getUrls();
    }

    @Post('/post/newURl')
    createshortUrls(@Body() body: {longUrl: string}) {
        return this.urlsservice.shortedNewUrls(body.longUrl);
    }
}