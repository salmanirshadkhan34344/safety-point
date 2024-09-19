import { Body, Controller, Get, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../libs/guard/jwt-auth.guard';
import { InterceptorHelper } from '../libs/helper/interceptors/custom-files-interceptor';
import { ResponseHelper } from '../libs/helper/response.helper';
import { DeleteReportDto, FriendNotifyForReporting, GetReportById, GetReportsDto, GetUserPrivateReportsDto, ReportReportedDto, createReportingDto, updateReportingDto } from './dto/reporting.dto';
import { ReportingService } from './reporting.service';


@Controller('api/reporting')
export class ReportingController {
  constructor(private readonly reportingService: ReportingService) { }

  @UseGuards(JwtAuthGuard)
  @Post('/add-report')
  @UseInterceptors(InterceptorHelper.globalFileInterceptorForFile('images', './public/report/'))
  async addReport(
    @UploadedFile() file,
    @Body() dto: createReportingDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    try {
      const data = await this.reportingService.addReport(dto, req, file)
      return ResponseHelper.success({ res, data })
    }
    catch (error) {
      return ResponseHelper.error({ res, req, error })

    }

  }
  @UseGuards(JwtAuthGuard)
  @Post('/edit-report')
  @UseInterceptors(InterceptorHelper.globalFileInterceptorForFile('images', './public/report/'))
  async editReport(
    @UploadedFile() file,
    @Body() dto: updateReportingDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    try {
      const user = await this.reportingService.editReport(dto, req, file)
      return ResponseHelper.success({ res, data: user })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor(''))
  @Post('/delete-report')
  async deleteReport(
    @Body() dto: DeleteReportDto,
    @Req() req: Request,
    @Res() res: Response

  ) {
    try {
      const deletedReport = await this.reportingService.deleteReport(dto, req);
      return ResponseHelper.success({ res, data: deletedReport });

    } catch (error) {
      return ResponseHelper.error({ res, req, error });

    }
  }
  @UseGuards(JwtAuthGuard)
  @Get('/get-report-history')
  async reportHistory(
    @Req() req: Request,
    @Res() res: Response
  ) {
    try {
      const reportsData = await this.reportingService.reportHistoryData(req);
      return ResponseHelper.success({ res, data: reportsData });
    } catch (error) {
      return ResponseHelper.error({ res, req, error });
    }
  }
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor(''))
  @Post('/get-user-public-reports')
  async publicReport(
    @Req() req: Request,
    @Res() res: Response,
    @Body() dto: GetUserPrivateReportsDto
  ) {
    try {

      const reportsData = await this.reportingService.getUserPublicReports(dto, req);
      return ResponseHelper.success({ res, data: reportsData });

    } catch (error) {
      return ResponseHelper.error({ res, req, error });

    }
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor(''))
  @Post('/get-user-private-reports')
  async privateReport(

    @Req() req: Request,
    @Res() res: Response,
    @Body() dto: GetUserPrivateReportsDto

  ) {
    try {

      const reportsData = await this.reportingService.getUserPrivateReports(dto, req);
      return ResponseHelper.success({ res, data: reportsData });

    } catch (error) {
      return ResponseHelper.error({ res, req, error });

    }
  }


  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor(''))
  @Post('/get-all-reports-by-incident-id')
  async getAllReportsByIncidentId(

    @Req() req: Request,
    @Res() res: Response,
    @Body() dto: GetUserPrivateReportsDto

  ) {
    try {

      const reportsData = await this.reportingService.getUserPrivateReports(dto, req);
      return ResponseHelper.success({ res, data: reportsData });

    } catch (error) {
      return ResponseHelper.error({ res, req, error });

    }
  }
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor(''))
  @Post('/get-report-by-id')
  async userReport(
    @Req() req: Request,
    @Res() res: Response,
    @Body() dto: GetReportById
  ) {
    try {
      const userReport: any = await this.reportingService.gerUserReport(dto, req)
      return ResponseHelper.success({ res, data: userReport });

    } catch (error) {
      return ResponseHelper.error({ res, req, error });

    }
  }

  // get private Reports by userId
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor(''))
  @Post('/get-private-report')
  async getUserPrivateReports(
    @Req() req: Request,
    @Res() res: Response,
    @Body() dto: GetReportsDto
  ) {
    try {
      let data: any = await this.reportingService.getFriendsAllReports(dto, req);
      return ResponseHelper.success({ res, data });
    } catch (error) {
      return ResponseHelper.error({ res, req, error });
    }
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor(''))
  @Post('/get-report')
  async getUserReports(
    @Req() req: Request,
    @Res() res: Response,
    @Body() dto: GetReportsDto
  ) {
    try {
      let data: any = await this.reportingService.getUserReports(dto);
      return ResponseHelper.success({ res, data });
    } catch (error) {
      return ResponseHelper.error({ res, req, error });
    }
  }


  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor(''))
  @Post('/report-reported')
  async reportReported(
    @Req() req: Request,
    @Res() res: Response,
    @Body() dto: ReportReportedDto
  ) {
    try {
      let data: any = await this.reportingService.reportReported(dto, req);
      return ResponseHelper.success({ res, data });
    } catch (error) {
      return ResponseHelper.error({ res, req, error });
    }
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor(''))
  @Get('/get-report-reported')
  async getReportReportedPaginated(
    @Req() req: Request,
    @Res() res: Response,
    @Query() query

  ) {
    try {
      let data: any = await this.reportingService.getReportReportedPaginated({ query, req });
      return ResponseHelper.success({ res, data });
    } catch (error) {
      return ResponseHelper.error({ res, req, error });
    }

  }


  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor(''))
  @Post('/notify-friend-for-report')
  async friendNotifyForReporting(
    @Body() dto: FriendNotifyForReporting,
    @Req() req: Request,
    @Res() res: Response

  ) {
    try {
      const deletedReport = await this.reportingService.friendNotifyForReporting(dto, req);
      return ResponseHelper.success({ res, data: deletedReport });

    } catch (error) {
      return ResponseHelper.error({ res, req, error });

    }
  }


}
