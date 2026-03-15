import { Injectable } from "@nestjs/common";

export type UrlsObj = {
    ShortCode : string,
    LongCode : string,
    CreatedAt : Date,
} 


@Injectable()
export class UrlsService {
    async getUrls() : Promise<UrlsObj> {
        return {
            'ShortCode' : 'https://apple.come', 
            'LongCode' : 'fjsfbfsbfsbfks',
            'CreatedAt' : new Date()
        };
    }
    async shortedNewUrls(longUrl : string) : Promise<{}>{
        return { 'message' : 'Uploaded seccufully'};
    }
}