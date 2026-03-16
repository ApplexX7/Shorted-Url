import { IsString, IsUrl, IsNotEmpty} from 'class-validator'

export class UrlDto {
    @IsString()
    @IsUrl()
    @IsNotEmpty()
    longetUrl : string
}