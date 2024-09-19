
import { Mapping } from '../orm/sql.model';
import { Chat } from './chat.entity';
import { Users } from './user.entity';

export class InboxActive extends Mapping {
  static table = 'inbox_active';


  static get relationMappings () {
    return {

      user: {
        relation: Mapping.BelongsToOneRelation,
        modelClass: Users,
        join: {
          from: 'users.id',
          to: 'inbox_active.addresser_id',
        },
      },

      last_message: {
        relation: Mapping.HasOneRelation,
        modelClass: Chat,
        filter (builder) {
          builder.orderBy('id', 'desc');
        },
        join: {
          from: 'chat.conversation_id',
          to: 'inbox_active.conversation_id',
        },
      },
    };

  }
}
