import { Body, Controller, Get, Post, Query, Req, Res, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { Roles } from '../libs/guard/roles.decorator';
import { ResponseHelper } from '../libs/helper/response.helper';
import { AdminService } from './admin.service';
import { BlockUsersPaginatedDto, DeleteReportPaginatedDto, ReportingCommentPaginatedDto, ReportingPaginatedDto, UpdateContentDto, UserAddressPaginatedDto, UserFriendPaginatedDto } from './dto/create-admin.dto';


@Controller('api/admin')
@Roles('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @UseInterceptors(FileInterceptor(''))
  @Post('/user-paginated')
  async userPaginated (
    @Body() dto: {},
    @Req() req: Request,
    @Res() res: Response,
    @Query() query
  ) {
    try {
      const data = await this.adminService.userPaginated({ req, query });
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }


  @UseInterceptors(FileInterceptor(''))
  @Post('/admin-paginated')
  async adminPaginated (
    @Body() dto: {},
    @Req() req: Request,
    @Res() res: Response,
    @Query() query
  ) {
    try {
      const data = await this.adminService.adminPaginated({ req, query });
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }


  @UseInterceptors(FileInterceptor(''))
  @Post('/reporting-paginated')
  async reportingPaginated (
    @Body() dto: ReportingPaginatedDto,
    @Req() req: Request,
    @Res() res: Response,
    @Query() query
  ) {
    try {
      const data = await this.adminService.reportingPaginated({ req, query, dto });
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }
  @UseInterceptors(FileInterceptor(''))
  @Post('/reported-paginated')
  async reportedPaginated (
    @Body() dto: ReportingPaginatedDto,
    @Req() req: Request,
    @Res() res: Response,
    @Query() query
  ) {
    try {
      const data = await this.adminService.reportedPaginated({ req, query, dto });
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }

  @UseInterceptors(FileInterceptor(''))
  @Post('/block-users-paginated')
  async blockUsersPaginated (
    @Body() dto: BlockUsersPaginatedDto,
    @Req() req: Request,
    @Res() res: Response,
    @Query() query
  ) {
    try {
      const data = await this.adminService.blockUsersPaginated({ req, query, dto });
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }

  @UseInterceptors(FileInterceptor(''))
  @Post('/incidents-paginated')
  async incidentsPaginated (
    @Body() dto: {},
    @Req() req: Request,
    @Res() res: Response,
    @Query() query
  ) {
    try {
      const data = await this.adminService.incidentsPaginated({ req, query, dto });
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }


  @UseInterceptors(FileInterceptor(''))
  @Post('/users-address-paginated')
  async usersAddressPaginated (
    @Body() dto: UserAddressPaginatedDto,
    @Req() req: Request,
    @Res() res: Response,
    @Query() query
  ) {
    try {
      const data = await this.adminService.usersAddressPaginated({ req, query, dto });
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }

  @UseInterceptors(FileInterceptor(''))
  @Post('/reporting-comments-paginated')
  async reportingCommentPaginated (
    @Body() dto: ReportingCommentPaginatedDto,
    @Req() req: Request,
    @Res() res: Response,
    @Query() query
  ) {
    try {
      const data = await this.adminService.reportCommentsPaginated({ req, query, dto });
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }

  @UseInterceptors(FileInterceptor(''))
  @Post('/reporting-like-paginated')
  async reportingLikePaginated (
    @Body() dto: ReportingCommentPaginatedDto,
    @Req() req: Request,
    @Res() res: Response,
    @Query() query
  ) {
    try {
      const data = await this.adminService.reportingLikePaginated({ req, query, dto });
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }

  @UseInterceptors(FileInterceptor(''))
  @Post('/friends-paginated')
  async friendsPaginated (
    @Body() dto: UserFriendPaginatedDto,
    @Req() req: Request,
    @Res() res: Response,
    @Query() query
  ) {
    try {
      const data = await this.adminService.friendsPaginated({ req, query, dto });
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }

  @UseInterceptors(FileInterceptor(''))
  @Post('/contact-us-paginated')
  async contactUsPaginated (
    @Body() dto: {},
    @Req() req: Request,
    @Res() res: Response,
    @Query() query
  ) {
    try {
      const data = await this.adminService.contactUsPaginated({ req, query, dto });
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }


  @Get('chart-current-year-users')
  async currentYearUsers (
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const data = await this.adminService.currentYearUsers();
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }

  @Get('chart-current-year-reporting')
  async currentYearWishes (
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const data = await this.adminService.currentYearReporting();
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }


  @UseInterceptors(FileInterceptor(''))
  @Post('/reporting-detail')
  async reportDetail (
    @Body() dto: ReportingCommentPaginatedDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const data = await this.adminService.reportingDetail(dto);
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }


  @UseInterceptors(FileInterceptor(''))
  @Post('/user-detail')
  async userDetail (
    @Body() dto: UserFriendPaginatedDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const data = await this.adminService.userDetail(dto);
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }


  @Get('/dashboard-info')
  async dashboardData (
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const data = await this.adminService.dashboardData();
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }

  @UseInterceptors(FileInterceptor(''))
  @Post('/update-content')
  async updateContent (
    @Body() dto: UpdateContentDto,
    @Req() req: Request,
    @Res() res: Response,
    @Query() query,
  ) {
    try {
      const data = await this.adminService.updateContent(dto);
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }


  @UseInterceptors(FileInterceptor(''))
  @Get('/card-header')
  async cardHeader (
      @Req() req: Request,
      @Res() res: Response,
  ) {
      try {
          const data = await this.adminService.cardHeader();
          return ResponseHelper.success({ res, data })
      } catch (error) {
          return ResponseHelper.error({ res, req, error })
      }
  }


  @UseInterceptors(FileInterceptor(''))
  @Post('/delete-report')
  async deleteReport (
    @Body() dto: DeleteReportPaginatedDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const data = await this.adminService.deleteReport(dto);
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }

}