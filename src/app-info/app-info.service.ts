import { Injectable } from '@nestjs/common';
import { raw } from 'objection';
import { ContactUs } from '../libs/database/entities/contact-us.entity';
import { Metas } from '../libs/database/entities/metas.entity';
import { SendEmailDto } from './dto/app-info.dto';

@Injectable()
export class AppInfoService {

  async aboutUs (req) {
    return await Metas.query().select(raw(`MAX(CASE WHEN meta_key = 'about_us'THEN meta_value END) about_us`))
      .where({ source_type: 'app-info' })
      .groupBy('source_id', 'user_id').first()
  }
  async termsAndServices (req) {
    return await Metas.query().select(raw(`MAX(CASE WHEN meta_key = 'terms_and_services'THEN meta_value END) terms_and_services`))
      .where({ source_type: 'app-info' })
      .groupBy('source_id', 'user_id').first()
  }

  async privacyPolicy (req) {
    return await Metas.query()
      .select(raw(`MAX(CASE WHEN meta_key = 'privacy_policy'THEN meta_value END) privacy_policy`))
      .where({ source_type: 'app-info' })
      .groupBy('source_id', 'user_id').first()
  }

  async sendEmail (dto: SendEmailDto, req, file) {
    let result: any = await ContactUs.query().insertAndFetch({
      sender_id: req.user.id,
      email: req?.user?.email,
      subject: dto.subject,
      message: dto.message,
      file: file ? 'contact-us/' + file?.filename : null
    })
    return result
  }
}
