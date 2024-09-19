import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { JwtAuthGuard } from '../libs/guard/jwt-auth.guard';
import { InterceptorHelper } from '../libs/helper/interceptors/custom-files-interceptor';
import { ResponseHelper } from '../libs/helper/response.helper';
import { AppInfoService } from './app-info.service';
import { SendEmailDto } from './dto/app-info.dto';


@Controller('api/app-info')
export class AppInfoController {
  constructor(private readonly appInfoService: AppInfoService) { }

  @Get("/about-us")
  async aboutUs (@Req() req: Request, @Res() res: Response) {
    try {
      const data = await this.appInfoService.aboutUs(req);
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }
  @Get("/terms-and-services")
  async termsAndServices (@Req() req: Request, @Res() res: Response) {
    try {
      const data = await this.appInfoService.termsAndServices(req);
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }
  @UseGuards(JwtAuthGuard)
  @Get("/privacy-policy")
  async privacyPolicy (
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const data = await this.appInfoService.privacyPolicy(req);
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }


  @UseGuards(JwtAuthGuard)
  @UseInterceptors(InterceptorHelper.globalFileInterceptorForFile('file', './public/contact-us/'))
  @Post('/send-email')
  async sendEmail (
    @Body() dto: SendEmailDto,
    @Req() req: Request,
    @Res() res: Response,
    @UploadedFile() file,

  ) {
    try {
      const data = await this.appInfoService.sendEmail(dto, req, file);
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }



}
